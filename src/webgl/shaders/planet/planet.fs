#version 300 es

precision highp float;

uniform mat4 modelMatrix;

uniform vec3 lightSource;
uniform vec3 lightColor;
uniform float time;

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
  return 1.0 - float( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0; 
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

vec4 fbm(vec3 modelPos, float freq, float G, int numOctaves) {
  float n = 0.0;
  float a = G;
  vec3 d = vec3(0.0);
  vec3 mPos = modelPos + 2.0;
  for (int i = 0; i < numOctaves; ++i) {
    vec4 nd = noise(mPos, freq);
    n += a * nd.x;
    d += a * nd.yzw;
    freq *= 2.0;
    a *= G;
  }
  return vec4(n, d);
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
  vec3 lightDir = normalize(lightSource - vPos.xyz);
  vec3 oceanColor = vec3(0.11, 0.13, 0.58);

  // Clouds
  vec4 fd = fbm(vPos.xyz + vec3(time, time, time), 2.0, 0.7, 8);
  float f = fd.x;
  vec3 cloudNormal = normalize((modelMatrix * vec4(normalize(fd.yzw), 0.0)).xyz);
  float clouds = min(max(0.0, f), 1.0) * 0.9;// * dot(cloudNormal, lightDir);

  // fragColor = vec4(fd.yzw, 1.0);

  vec3 wNormal = normalize(wNormal);
  float light = clamp(dot(wNormal, lightDir), 0.0, 1.0) + 0.02;
  vec3 color = clouds * vec3(1.0, 1.0, 1.0) + (1.0 - clouds) * (oceanColor * light);
  fragColor = vec4(color * lightColor, 1.0);
}