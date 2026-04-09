import galeriaData from '@/app/data/galeriaSalida.json'

export async function GET() {
  return new Response(JSON.stringify({
    carrusel: galeriaData.carrusel,
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
    }
  });
}