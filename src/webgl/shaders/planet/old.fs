#version 300 es

precision highp float;

uniform vec3 lightSource;
uniform vec3 lightColor;

in vec4 vPos;
in vec4 oNormal;
in vec3 wNormal;

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

float noise(vec3 spos, vec3 axis) {
  ivec3 ipos = ivec3(floor(spos));
  ivec3 nipos = ivec3(floor(spos + axis));
  float frac = dot(spos - vec3(ipos), axis);
  
  return frac * intNoise(nipos) + (1.0 - frac) * intNoise(ipos);
}

float noise_2d(vec3 spos) {
  float nx1 = noise(spos, vec3(1.0, 0.0, 0.0));
  vec3 nxtYPos = spos + vec3(0.0, 1.0, 0.0);
  float nx2 = noise(nxtYPos, vec3(1.0, 0.0, 0.0));
  float yFrac = nxtYPos.y - floor(nxtYPos.y);
  float n = yFrac * nx2 + (1.0 - yFrac) * nx1;
  return n;
}

float noise(vec3 modelPos, float freq) {
  vec3 spos = modelPos * freq;
  float nz1 = noise_2d(spos);
  vec3 nxtZPos = spos + vec3(0.0, 0.0, 1.0);
  float nz2 = noise_2d(nxtZPos);
  float zFrac = nxtZPos.z - floor(nxtZPos.z);

  return zFrac * nz2 + (1.0 - zFrac) * nz1;
}

float fbm(vec3 modelPos, float freq, float G, int numOctaves) {
  float n = 0.0;
  float a = G;
  vec3 mPos = modelPos + 2.0;
  for (int i = 0; i < numOctaves; ++i) {
    n += a * noise(mPos, freq);
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
  // vec3 oceanColor = vec3(0.06, 0.12, 0.39);
  vec3 oceanColor = vec3(0.11, 0.13, 0.58);
  float f = fbm(vPos.xyz, 2.0, 0.707, 6);
  float clouds = max(0.0, f * f - 1.2);

  vec3 color = clouds * vec3(1.0, 1.0, 1.0) + (1.0 - clouds) * oceanColor;
  vec3 wNormal = normalize(wNormal);
  float light = clamp(dot(wNormal, normalize(lightSource - vPos.xyz)), 0.0, 1.0) + 0.02;
  fragColor = vec4(color * light * lightColor, 1.0);
}