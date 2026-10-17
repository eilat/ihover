# Original upbeat electronic groove for the 9 s bold-type title, 120 BPM, beat 0 at 0.3 s (the first word hit).
# Synthesised here (no samples, no licence questions) -> music.wav, 44.1 kHz stereo.
import wave
import numpy as np

SR, DUR, B0, BEAT = 44100, 9.0, 0.3, 0.5
n = int(SR * DUR); t = np.arange(n) / SR
rng = np.random.default_rng(11)
L = np.zeros(n); R = np.zeros(n)
FIN = B0 + 8 * BEAT   # 4.3 s: the title card lands

def put(x, t0, gl=1.0, gr=1.0):
    i = int(t0 * SR)
    if i >= n: return
    m = min(len(x), n - i); L[i:i + m] += x[:m] * gl; R[i:i + m] += x[:m] * gr

def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y

def kick(g=1.0):
    d = 0.42; u = np.arange(int(SR * d)) / SR
    f = 48 + 110 * np.exp(-u * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return g * (np.sin(ph) * np.exp(-u * 7.5) + 0.25 * np.exp(-u * 300) * rng.standard_normal(len(u)) * 0.3)

def clap(g=1.0):
    d = 0.3; u = np.arange(int(SR * d)) / SR
    nz = rng.standard_normal(len(u)); bp = lp(nz, 3200) - lp(nz, 900)
    env = sum(np.exp(-np.clip(u - k * 0.011, 0, None) * 140) * (u >= k * 0.011) for k in range(3)) + 0.6 * np.exp(-u * 18)
    return g * bp * env * 0.9

def hat(g=1.0, open_=False):
    d = 0.18 if open_ else 0.05; u = np.arange(int(SR * d)) / SR
    nz = rng.standard_normal(len(u)); hp = nz - lp(nz, 7000)
    return g * hp * np.exp(-u * (18 if open_ else 90))

def pluck(freqs, d=0.45, g=1.0, bright=2600):
    u = np.arange(int(SR * d)) / SR; x = np.zeros(len(u))
    for f in freqs:
        for det in (-0.004, 0.004):
            ph = 2 * np.pi * f * (1 + det) * u
            x += 2 * ((ph / (2 * np.pi)) % 1) - 1   # saw
    x = lp(x, bright) * np.exp(-u * 6) * np.clip(u / 0.003, 0, 1)
    return g * x / len(freqs)

def bass(f, d=0.24, g=1.0):
    u = np.arange(int(SR * d)) / SR
    x = np.sin(2 * np.pi * f * u) + 0.35 * np.sin(4 * np.pi * f * u)
    return g * np.tanh(1.6 * x) * np.exp(-u * 6) * np.clip(u / 0.004, 0, 1) * np.clip((d - u) / 0.02, 0, 1)

# chords per bar (4 beats = 2 s): Am, F, then C on the landing, G, C
A3, C4, E4, F3, G3, B3, D4 = 220.0, 261.63, 329.63, 174.61, 196.0, 246.94, 293.66
BARS = [((A3, C4, E4), 55.0), ((F3, A3, C4), 43.65), ((C4, E4, G3 * 2), 65.41), ((G3, B3, D4), 49.0), ((C4, E4, G3 * 2), 65.41)]
# riser into the first hit (0..0.3 s) and into the landing (3.3..4.3 s)
def riser(t0, t1, g):
    m = (t >= t0) & (t < t1); u = (t[m] - t0) / (t1 - t0)
    nz = rng.standard_normal(m.sum()); x = (nz - lp(nz, 600 + 5000 * 0)) * u ** 2.5 * g
    L[m] += x; R[m] += np.roll(x, 211)
riser(0.0, B0, 0.18); riser(3.3, FIN, 0.22)

nbeats = int((DUR - B0) / BEAT) + 1
for k in range(nbeats):
    tb = B0 + k * BEAT
    if tb >= DUR - 0.05: break
    bar = min(k // 4, len(BARS) - 1); chord, root = BARS[bar]
    after = tb >= FIN
    calm = tb >= FIN + 3.0                       # last stretch: lighter, lets the presenter talk
    put(kick(0.95 if not calm else 0.6), tb)
    if k % 2 == 1: put(clap(0.55 if not calm else 0.35), tb)
    for h in range(2):                           # 8th hats, the off-beat one a little louder
        th = tb + h * BEAT / 2
        put(hat(0.10 + 0.07 * h, open_=(h == 1 and k % 4 == 3)), th, 0.8, 1.0)
    # bass on the off-beats (pumping), root note
    put(bass(root * 2, g=0.5 if not calm else 0.32), tb + BEAT / 2)
    # chord stab on every word hit before the landing, then on beats 1 and 3
    if (not after) or k % 2 == 0:
        put(pluck(chord, g=0.42 if not calm else 0.28, bright=2400 if not after else 3400), tb, 0.9, 1.0)

# the landing: a wide C major chord with a soft bell on top, plus a crash-like noise wash
u = np.arange(int(SR * 2.6)) / SR
pad = sum(np.sin(2 * np.pi * f * u) * (0.5 if i else 1) for i, f in enumerate([130.81, 261.63, 329.63, 392.0, 523.25]))
put(0.22 * pad * np.exp(-u * 1.3) * np.clip(u / 0.01, 0, 1), FIN)
for j, f in enumerate([1046.5, 1318.5, 1568.0]):
    uu = np.arange(int(SR * 1.2)) / SR
    put(0.07 * np.sin(2 * np.pi * f * uu) * np.exp(-uu * 3), FIN + 0.5 + j * 0.08, 0.6 + 0.2 * j, 1.0 - 0.2 * j)
nz = rng.standard_normal(int(SR * 1.4)); uu = np.arange(len(nz)) / SR
put(0.16 * (nz - lp(nz, 5000)) * np.exp(-uu * 3.2), FIN)

# small room + final fade
ir = lp(rng.standard_normal(int(SR * 0.6)), 5000) * np.exp(-np.arange(int(SR * 0.6)) / SR * 9)
def conv(x, h):
    m = len(x) + len(h); nf = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(h, nf), nf)[:len(x)]
pk = max(np.abs(L).max(), np.abs(R).max())
wl, wr = conv(L, ir), conv(R, ir[::-1].copy())
wl *= pk / (np.abs(wl).max() + 1e-9); wr *= pk / (np.abs(wr).max() + 1e-9)
L = L + 0.18 * wl; R = R + 0.18 * wr
fade = np.clip((DUR - t) / 0.8, 0, 1); L *= fade; R *= fade
st = np.tanh(1.2 * np.stack([L, R], 1) / max(np.abs(L).max(), np.abs(R).max()))
st = st / np.abs(st).max() * 0.89
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('music.wav ok')
