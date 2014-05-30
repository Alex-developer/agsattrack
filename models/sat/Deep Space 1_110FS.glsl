precision highp float;
varying vec3 v_normal;
uniform vec3 u_light0Color;
uniform vec3 u_light1Color;
uniform float u_shininess;
uniform vec4 u_ambient;
uniform vec4 u_diffuse;
uniform vec4 u_specular;
void main(void) {
vec3 normal = normalize(v_normal);
if (gl_FrontFacing == false) normal = -normal;
vec4 color = vec4(0., 0., 0., 0.);
vec4 diffuse = vec4(0., 0., 0., 1.);
vec3 diffuseLight = vec3(0., 0., 0.);
vec4 ambient;
vec4 specular;
vec3 ambientLight = vec3(0., 0., 0.);
{
ambientLight += u_light0Color;
}
{
ambientLight += u_light1Color;
}
ambient = u_ambient;
diffuse = u_diffuse;
specular = u_specular;
ambient.xyz *= ambientLight;
color.xyz += ambient.xyz;
//diffuse.xyz *= diffuseLight;
color.xyz += diffuse.xyz;
color = vec4(color.rgb * diffuse.a, diffuse.a);
gl_FragColor = color;
}
