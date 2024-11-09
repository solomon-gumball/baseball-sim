export default function DebugDataView({ data }: { data: any }) {
  return (
    <pre style={{ backgroundColor: 'rgb(50, 50, 50)', color: 'white', padding: 5, marginLeft: 5, marginRight: 5, borderRadius: 5 }}>
      <code style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
        {JSON.stringify(data, null, 4)}
      </code>
    </pre>
  )
}