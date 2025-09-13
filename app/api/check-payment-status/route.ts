export async function POST(request: Request) {
  const { tx_ref } = await request.json();

  const flutterwaveResponse = await fetch(
    `https://api.flutterwave.com/v3/transactions?tx_ref=${tx_ref}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    }
  );
  
  const data = await flutterwaveResponse.json();
  return Response.json({ success: true, data: data.data[0] });
}