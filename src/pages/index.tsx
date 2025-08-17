import Head from 'next/head'

export default function Home() {
  const gasPrices = {
    regular: 9.99,
    midgrade: 9.99,
    premium: 9.99,
    diesel: 9.99,
  }

  return (
    <>
      <Head>
        <title>Save-A-Dollar | Gas Prices</title>
      </Head>

      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-6">Today’s Gas Prices</h1>

        <div className="grid grid-cols-2 gap-4 max-w-md">
          {Object.entries(gasPrices).map(([type, price]) => (
            <div key={type} className="bg-white p-4 shadow rounded">
              <p className="capitalize text-lg font-medium">{type}</p>
              <p className="text-2xl font-bold text-green-700">${price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}