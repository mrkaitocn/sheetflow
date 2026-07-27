import DashboardClient from './DashboardClient';

export async function generateStaticParams() {
  return [{ id: 'demo' }];
}

export default function Page({ params }) {
  return <DashboardClient params={params} />;
}
