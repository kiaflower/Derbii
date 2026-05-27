const cards = ['Total Sales', 'Orders', 'Low Stock', 'Conversion'];

export default function Dashboard() {
  return (
    <div className='luxury-container py-12'>
      <h1 className='text-4xl mb-8'>DERBII Admin Dashboard</h1>
      <div className='grid md:grid-cols-4 gap-4'>
        {cards.map((c) => (
          <div key={c} className='card rounded p-6'>{c}</div>
        ))}
      </div>
    </div>
  );
}
