# Synthesises a short ambient "cosmic" score for the 9 s title animation -> music.wav (44.1 kHz stereo).
# Original, generated here, so there are no licence questions.
import wave
import numpy as np

SR, DUR = 44100, 9.0
n = int(SR * DUR)
t = np.arange(n) / SR
rng = np.random.default_rng(3)
L = np.zeros(n); R = np.zeros(n)

def env(a, b, fade_in, fade_out):
    e = np.clip((t - a) / fade_in, 0, 1) * np.clip((b - t) / fade_out, 0, 1)
    return e * e * (3 - 2 * e)   # smoothstep

def voice(f, amp, e, det=0.003, vib=0.2):
    out = []
    for s in (-1, 1):
        ff = f * (1 + s * det)
        ph = 2 * np.pi * ff * t + 0.6 * np.sin(2 * np.pi * vib * t + s)
        x = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
        out.append(amp * e * x)
    return out

def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)): acc = (1 - a) * x[i] + a * acc; y[i] = acc
    return y

# pad 1: A minor 9 (mystery), fades in, hands over to the resolution
A = [110, 164.81, 220, 261.63, 329.63, 493.88]
e1 = env(0.0, 5.3, 2.4, 1.0)
for i, f in enumerate(A):
    l, r = voice(f, 0.09 / (1 + 0.25 * i), e1, vib=0.13 + 0.03 * i)
    L += l * (1 - 0.15 * i / 5); R += r * (0.85 + 0.15 * i / 5)

# pad 2: C major add 9 (warm, resolved) when the title lands, held to the end
Cm = [65.41, 130.81, 196.0, 261.63, 329.63, 392.0, 587.33]
e2 = env(4.5, 9.0, 0.7, 1.1)
for i, f in enumerate(Cm):
    l, r = voice(f, 0.085 / (1 + 0.2 * i), e2, vib=0.11 + 0.025 * i)
    L += l; R += r

# airy rise while the stardust spirals in (filtered noise swelling up to the landing)
nz = rng.standard_normal(n)
air = lowpass(nz, 1800) - lowpass(nz, 500)
er = np.clip((t - 1.9) / 2.75, 0, 1) ** 2.2 * np.clip((4.95 - t) / 0.3, 0, 1)
L += 0.22 * air * er; R += 0.22 * np.roll(air, 157) * er

# twinkles: sparse soft high plinks, panned around (deterministic)
for k in range(26):
    t0 = 0.4 + rng.random() * 8.0; f = rng.choice([1567.98, 1760, 2093, 2349.3, 2637, 3136]); pan = rng.random()
    m = t >= t0; u = t[m] - t0
    x = 0.05 * np.sin(2 * np.pi * f * u) * np.exp(-u * 5.5) * np.clip(u / 0.004, 0, 1)
    L[m] += x * (1 - pan); R[m] += x * pan

# the landing: a soft bell arpeggio (C E G C D) and a gentle low swell instead of a hit
for j, f in enumerate([1046.5, 1318.5, 1568, 2093, 2349.3]):
    t0 = 4.65 + j * 0.09; m = t >= t0; u = t[m] - t0
    x = 0.09 * np.exp(-u * 2.2) * (np.sin(2 * np.pi * f * u) + 0.3 * np.sin(2 * np.pi * 2.76 * f * u) * np.exp(-u * 4))
    L[m] += x * (0.65 - 0.07 * j); R[m] += x * (0.35 + 0.07 * j)
sw = env(4.55, 7.5, 0.25, 2.5)
L += 0.16 * np.sin(2 * np.pi * 65.41 * t) * sw; R += 0.16 * np.sin(2 * np.pi * 65.41 * t) * sw

# reverb: convolution with 2.4 s of decaying, darkened stereo noise
ir_n = int(SR * 2.4); it = np.arange(ir_n) / SR
irL = lowpass(rng.standard_normal(ir_n), 4500) * np.exp(-it * 2.6)
irR = lowpass(rng.standard_normal(ir_n), 4500) * np.exp(-it * 2.6)
def conv(x, ir):
    m = len(x) + len(ir); nf = 1 << (m - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(ir, nf), nf)[:len(x)]
wl, wr = conv(L, irL), conv(R, irR)
wl /= np.abs(wl).max() + 1e-9; wr /= np.abs(wr).max() + 1e-9
dry = max(np.abs(L).max(), np.abs(R).max())
L = 0.65 * L / dry + 0.45 * wl; R = 0.65 * R / dry + 0.45 * wr

# final fade so the file ends cleanly, then normalise
fade = np.clip((DUR - t) / 0.9, 0, 1)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], 1) / peak * 0.85
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print('music.wav', round(DUR, 2), 's')
