// addon.cc
#include <node.h>
#include "sha3.cc"

//Local macroses
#define cByteSize       ((uint8_t)8)
#define cSHASize        ((uint16_t)512)
#define cStringArrayMax ((uint16_t)1024)
#define OPTIMAZE        ((uint8_t)1)

//Local variables
static char aCharArrayL[cStringArrayMax]; 


//Local function Prototypes
static const uint8_t* CalculateSHA3 (const char * pU8ArrayP, uint8_t u8SizeP);
static uint8_t* StringToHex(uint8_t* pCharArrayP, uint8_t u8CountOfBytesP);

namespace sha3 {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;
// This is the implementation of the "add" method
// Input arguments are passed using the
// const FunctionCallbackInfo<Value>& args struct
void sha3_512_JS(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
#ifndef OPTIMAZE
  // Check the number of arguments passed.
  if (args.Length() < 1) {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong number of arguments")));
    return;
  }

  // Check the argument types
  if (!args[0]->IsString()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong arguments - \"Try string\" ")));
    return;
  }
#endif
    
  // Perform the operation
    String::Utf8Value str(args[0]);
    const char* bufArray = *str;
    const uint8_t* hashHex;
    
    hashHex = CalculateSHA3(bufArray, str.length());
    
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, (char*)hashHex));
}
    
void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "sha3_512", sha3_512_JS);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace sha3

static const uint8_t* CalculateSHA3 (const char * pCharArrayP, uint8_t u8SizeP)
{    
    sha3_context c;
    uint8_t* pU8HashL;
    
    //Apply SHA3
    sha3_Init512(&c);
    sha3_Update(&c, pCharArrayP, u8SizeP);
    pU8HashL = (uint8_t*) sha3_Finalize(&c);

    pU8HashL = StringToHex(pU8HashL, cSHASize/cByteSize);

    return pU8HashL;
}

static uint8_t* StringToHex(uint8_t* pCharArrayP, uint8_t u8CountOfBytesP)
{     
    int i;
    
    //Convert char array to hex string
    for (i = 0; i < u8CountOfBytesP; i++)
    {
         sprintf ( &aCharArrayL[i*2],"%02x", pCharArrayP[i]);
    }
   
    return (uint8_t*) aCharArrayL;
}
