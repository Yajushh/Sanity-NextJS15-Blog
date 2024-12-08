export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <section>
      User Profile
      <h1>Id: {id}</h1>
    </section>
  );
}
