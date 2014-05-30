precision highp float;
varying vec3 v_normal;
uniform vec3 u_light0Color;
uniform vec3 u_light1Color;
uniform vec4 u_diffuse;
void main(void) {
vec3 normal = normalize(v_normal);
vec4 color = vec4(0., 0., 0., 0.);
vec4 diffuse = vec4(0., 0., 0., 1.);
vec3 diffuseLight = vec3(0., 0., 0.);
vec3 ambientLight = vec3(0., 0., 0.);
{
ambientLight += u_light0Color;
}
{
ambientLight += u_light1Color;
}
diffuse = u_diffuse;
//diffuse.xyz *= diffuseLight;
color.xyz += diffuse.xyz;
color = vec4(color.rgb * diffuse.a, diffuse.a);
gl_FragColor = color;
}
