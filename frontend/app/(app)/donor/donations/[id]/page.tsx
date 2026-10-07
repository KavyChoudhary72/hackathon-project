import LiveTrackerClient from "./LiveTrackerClient";

// Required for Next.js static HTML export (output: 'export')
export function generateStaticParams() {
  return [
    { id: "1025" },
    { id: "DN1025" },
    { id: "1026" },
  ];
}

export default function LiveTrackerPage({
  params,
}: {
  params: { id: string };
}) {
  return <LiveTrackerClient params={params} />;
}