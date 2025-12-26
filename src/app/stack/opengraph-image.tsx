import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Tech Stack'
export const contentType = 'image/png'

export default async function og() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          padding: '40px'
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 20
          }}
        >
          Tech Stack
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#666',
            textAlign: 'center'
          }}
        >
          Frontend Technologies & Tools
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
