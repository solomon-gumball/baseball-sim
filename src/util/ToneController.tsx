import { lerp } from "three/src/math/MathUtils";

// Function to create and control tone
export default class ToneController {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode | null;
  private gainNode: GainNode;
  private delayNode: DelayNode;
  private flangerOscillator: OscillatorNode;
  private flangerGain: GainNode;
  private muted: boolean = false;

  constructor() {
    // Initialize the audio context
    // @ts-ignore
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillator = null;

    // Create a GainNode to control volume
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime); // Default volume is 1 (100%)

    // Create a DelayNode for the flanger effect
    this.delayNode = this.audioContext.createDelay();
    this.delayNode.delayTime.setValueAtTime(0.005, this.audioContext.currentTime); // Initial delay (5ms)

    // Create an oscillator to modulate the delay time for the flanger effect
    this.flangerOscillator = this.audioContext.createOscillator();
    this.flangerOscillator.type = 'sine'; // Use sine wave to modulate the delay

    // Create a GainNode to control the depth of the modulation (how much delay changes)
    this.flangerGain = this.audioContext.createGain();
    this.flangerGain.gain.setValueAtTime(0.002, this.audioContext.currentTime); // Modulation depth (2ms)

    // Connect the flanger modulation
    this.flangerOscillator.connect(this.flangerGain);
    this.flangerGain.connect(this.delayNode.delayTime); // Modulate delay time

    // Connect the GainNode to the DelayNode, then to destination (speakers)
    this.gainNode.connect(this.delayNode);
    this.delayNode.connect(this.audioContext.destination);

    // Start the flanger modulation
    this.flangerOscillator.start();
  }

  // Start playing the tone
  public startTone(frequency: number) {
    if (this.oscillator) {
      this.oscillator.stop(); // Stop existing oscillator if already running
    }

    // Create an oscillator
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'square'; // Type of wave: sine, square, triangle, sawtooth
    // this.oscillator.type = 'triangle'; // Type of wave: sine, square, triangle, sawtooth
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime); // Set initial frequency

    // Connect the oscillator to the GainNode (for volume control)
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
  }
  // Update the depth of the flanger effect
  public updateFlangerDepth(depth: number) {
    this.flangerGain.gain.setValueAtTime(depth, this.audioContext.currentTime);
  }

  public updateFromFlightProgress(progress: number) {
    const heightNormalized = Math.abs(0.5 - progress) * 2
    this.updateFrequency(200 + lerp(100, 0, heightNormalized))
    this.updateFlangerDepth(.00005)
    this.updateVolume(progress * .05)
  }

  // Update the frequency while playing
  public updateFrequency(frequency: number) {
    if (this.oscillator) {
      this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    }
  }

  // Update the volume
  public updateVolume(volume: number) {
    if (!this.muted) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  public toggleMute(muted: boolean) {
    this.muted = muted
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
  }

  // Stop the tone
  public stopTone() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator = null;
    }
  }
}
