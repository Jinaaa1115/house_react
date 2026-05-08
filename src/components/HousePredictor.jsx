import { useState, useEffect } from 'react'

// ✏️ Replace with your Render backend URL
const API_URL = "https://house-prediction-backend-pzu3.onrender.com"

const BEDROOMS = [1, 2, 3, 4, 5, 6]

export default function HousePredictor() {
  const [area, setArea] = useState('')
  const [bedrooms, setBedrooms] = useState(3)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ version: '—', total_samples: '—' })

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(r => r.json())
      .then(d => setStats({ version: d.version ?? '—', total_samples: d.total_samples ?? '—' }))
      .catch(() => {})
  }, [])

  async function predict() {
    setError('')
    setResult(null)

    const areaNum = parseFloat(area)
    if (!area || isNaN(areaNum)) return setError('Please enter a valid area.')
    if (areaNum < 100 || areaNum > 10000) return setError('Area must be between 100 and 10,000 sq ft.')

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area_sqft: areaNum, bedrooms }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Something went wrong.')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Could not connect to the API.')
    } finally {
      setLoading(false)
    }
  }

  const formatted = result
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.predicted_price)
    : null

  const perSqft = result
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(result.predicted_price / result.area_sqft)
    : null

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT PANEL */}
      <div
        className="relative lg:w-1/2 flex flex-col justify-between p-10 lg:p-16 overflow-hidden"
        style={{ backgroundColor: '#2c1f14' }}
      >
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full border-[50px] opacity-10" style={{ borderColor: '#c9922a' }} />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full border-[35px] opacity-[0.07]" style={{ borderColor: '#c9922a' }} />

        {/* brand */}
        <p className="relative z-10 text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#c9922a' }}>
          EstateIQ · ML Powered
        </p>

        {/* headline */}
        <div className="relative z-10 my-10">
          <h1
            className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif", color: '#f5f0e8' }}
          >
            Estimate your<br />
            <em style={{ color: '#e8b84b' }}>home's</em><br />
            true value.
          </h1>
          <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: 'rgba(245,240,232,0.55)' }}>
            Enter your property details and get an instant price prediction powered by a machine learning model trained on real estate data.
          </p>
        </div>

        {/* stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: '96.3%', label: 'R² Accuracy' },
            { value: stats.total_samples, label: 'Total Samples' },
            { value: stats.version, label: 'API Version' },
          ].map(s => (
            <div key={s.label} className="border-l-2 pl-3" style={{ borderColor: '#c9922a' }}>
              <div
                className="text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif", color: '#e8b84b' }}
              >
                {s.value}
              </div>
              <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(245,240,232,0.4)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* house emoji watermark */}
        <div className="absolute bottom-8 right-6 text-9xl opacity-[0.05] pointer-events-none select-none">🏠</div>
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:w-1/2 flex flex-col justify-center p-10 lg:p-16 bg-[#f5f0e8]">
        <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold mb-1 text-[#2c1f14]">
          Get an Estimate
        </h2>
        <p className="text-sm mb-8" style={{ color: '#8b6347' }}>Fill in two details — we'll handle the rest.</p>

        {/* Area input */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: '#5a3e28' }}>
            Area (sq ft)
          </label>
          <input
            type="number"
            value={area}
            onChange={e => setArea(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && predict()}
            placeholder="e.g. 2500"
            className="w-full bg-white border-[1.5px] rounded-xl text-lg font-semibold px-4 py-3 outline-none transition-all"
            style={{
              borderColor: '#d4c4a8',
              color: '#2c1f14',
              fontFamily: "'Outfit', sans-serif",
            }}
            onFocus={e => e.target.style.borderColor = '#c9922a'}
            onBlur={e => e.target.style.borderColor = '#d4c4a8'}
          />
          <p className="text-[11px] mt-1" style={{ color: '#8b6347' }}>Typical range: 500 – 5,000 sq ft</p>
        </div>

        {/* Bedroom selector */}
        <div className="mb-7">
          <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: '#5a3e28' }}>
            Bedrooms
          </label>
          <div className="grid grid-cols-6 gap-2">
            {BEDROOMS.map(n => (
              <button
                key={n}
                onClick={() => setBedrooms(n)}
                className="py-3 rounded-lg text-sm font-semibold border-[1.5px] transition-all"
                style={{
                  background: bedrooms === n ? '#c9922a' : 'white',
                  borderColor: bedrooms === n ? '#c9922a' : '#d4c4a8',
                  color: bedrooms === n ? 'white' : '#5a3e28',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Predict button */}
        <button
          onClick={predict}
          disabled={loading}
          className="w-full py-4 rounded-xl text-base font-semibold tracking-wide transition-all"
          style={{
            background: loading ? '#d4c4a8' : '#2c1f14',
            color: loading ? '#8b6347' : '#f5f0e8',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce inline-block w-2 h-2 rounded-full bg-[#8b6347]" style={{ animationDelay: '0ms' }} />
                <span className="animate-bounce inline-block w-2 h-2 rounded-full bg-[#8b6347]" style={{ animationDelay: '150ms' }} />
                <span className="animate-bounce inline-block w-2 h-2 rounded-full bg-[#8b6347]" style={{ animationDelay: '300ms' }} />
              </span>
            : 'Estimate Price →'
          }
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Result card */}
        {result && (
          <div
            className="mt-5 bg-white border-[1.5px] rounded-2xl p-6 animate-[fadeUp_0.35s_ease]"
            style={{ borderColor: '#d4c4a8' }}
          >
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: '#8b6347' }}>
              Estimated Market Price
            </p>
            <p
              className="text-5xl font-black tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#c9922a' }}
            >
              {formatted}
            </p>
            <p className="text-xs mt-1" style={{ color: '#8b6347' }}>
              Based on {result.area_sqft.toLocaleString()} sq ft · {result.bedrooms} bedroom{result.bedrooms !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t" style={{ borderColor: '#d4c4a8' }}>
              {[
                { val: perSqft, key: 'Per Sq Ft' },
                { val: `${result.area_sqft.toLocaleString()} sqft`, key: 'Area' },
                { val: `${result.bedrooms} bed${result.bedrooms !== 1 ? 's' : ''}`, key: 'Bedrooms' },
              ].map(item => (
                <div key={item.key} className="rounded-xl px-3 py-3 text-center" style={{ background: '#ede5d4' }}>
                  <p className="text-sm font-semibold text-[#2c1f14]">{item.val}</p>
                  <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: '#8b6347' }}>{item.key}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
