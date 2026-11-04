import { ResumeAdminSession } from './resume-admin-session';

export default async function SessionPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const { redirect } = await searchParams;
  const origin = 'https://web.invalid';
  const adminPath =
    typeof redirect === 'string' &&
    (redirect === '/admin' || redirect.startsWith('/admin/') || redirect.startsWith('/admin?'));
  const target = new URL(adminPath ? redirect : '/admin', origin);
  const destination =
    target.origin === origin &&
    (target.pathname === '/admin' || target.pathname.startsWith('/admin/'))
      ? target.pathname + target.search
      : '/admin';
  return <ResumeAdminSession destination={destination} />;
}
