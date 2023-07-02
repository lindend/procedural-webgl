#version 300 es

precision mediump float;

in vec3 modelPos;
out vec4 fragColor;

/*
algorithm fnv-1a is
    hash := FNV_offset_basis

    for each byte_of_data to be hashed do
        hash := hash XOR byte_of_data
        hash := hash × FNV_prime

    return hash 
  
FNV_offset_basis: 2166136261  
FNV_prime: 16777619

*/

int fnv_int(int hash, int x) {
  hash = (hash ^ (x & 0xff)) * 16777619;
  hash = (hash ^ ((x >> 8) & 0xff)) * 16777619;
  hash = (hash ^ ((x >> 16) & 0xff)) * 16777619;
  hash = (hash ^ ((x >> 24) & 0xff)) * 16777619;
  return hash;
}

int fnv_hash(ivec3 x) {
  int hash = 2166136261;

  hash = fnv_int(hash, x.x);
  hash = fnv_int(hash, x.y);
  hash = fnv_int(hash, x.z);

  return hash;
}

float intNoise(ivec3 ipos) {
  int x = fnv_hash(ipos);
  x = (x<<13) ^ x;
  return float( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 2147483648.0; 
}

vec4 noise(vec3 modelPos, float freq) {
  vec3 spos = modelPos * freq;
  vec3 fr = fract(spos);
  ivec3 ipos = ivec3(floor(spos));

  float p0 = intNoise(ipos);
  float px = intNoise(ipos + ivec3(1, 0, 0));
  float py = intNoise(ipos + ivec3(0, 1, 0));
  float pxy = intNoise(ipos + ivec3(1, 1, 0));
  float pz = intNoise(ipos + ivec3(0, 0, 1));
  float pzx = intNoise(ipos + ivec3(1, 0, 1));
  float pzy = intNoise(ipos + ivec3(0, 1, 1));
  float pzxy = intNoise(ipos + ivec3(1, 1, 1));

  float xn = p0 + (px - p0) * fr.x;
  float yn = xn + ((py + (pxy - py) * fr.x) - xn) * fr.y;
  float znx = pz + (pzx - pz) * fr.x;
  float zny = znx + ((pzy + (pzxy - pzy) * fr.x) - znx) * fr.y;
  float zn = yn + (zny - yn) * fr.z;
  
  vec3 d = vec3(px - p0, py - p0, pz - p0);

  return vec4(zn, d);
}

float fbm(vec3 modelPos, float freq, float G, int numOctaves) {
  float n = 0.0;
  float a = G;
  vec3 mPos = modelPos + 2.0;
  for (int i = 0; i < numOctaves; ++i) {
    n += a * noise(mPos, freq).x;
    freq *= 2.0;
    a *= G;
  }
  return n;
}

float lowPass(float n, float m) {
  if (n < m) {
    return 0.0;
  } else {
    return n;
  }
}

void main() {
  vec3 nebulaColor = vec3(0.1, 0.5, 0.8);
  float n = fbm(modelPos, 16.0, 0.5, 8);

  vec3 color = vec3(noise(modelPos, 4.0).yzx);
  float stars = lowPass(fbm(modelPos, 128.0, 0.8, 4) * 0.5, 0.98) * 0.5;
  // vec3 color = max(n * nebulaColor - 0.4, 0.0) + vec3(stars, stars, stars);
  // float n = 
  //   0.4 * noise(modelPos, freq) + 
  //   0.4 * noise(modelPos, freq * 2.0) +
  //   0.4 * noise(modelPos, freq * 4.0) +
  //   0.4 * noise(modelPos, freq * 8.0) +
  //   0.4 * noise(modelPos, freq * 16.0) +
  //   0.4 * noise(modelPos, freq * 32.0) +
  //   0.4 * noise(modelPos, freq * 64.0);

  fragColor = vec4(color, 1.0);
}