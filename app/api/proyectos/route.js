import proyectosData from '@/app/data/proyectos.json'

export async function GET() {
  return new Response(JSON.stringify({
    proyectos: proyectosData.proyectos  // ✅ "proyectos" no "proyetos"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
    }
  });
}