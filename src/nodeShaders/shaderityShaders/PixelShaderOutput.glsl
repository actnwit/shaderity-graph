
void pixelShaderOutput(in vec4 rt0) {
  #ifndef GLSL_ES3
    gl_FragColor = rt0;
  #endif
}
