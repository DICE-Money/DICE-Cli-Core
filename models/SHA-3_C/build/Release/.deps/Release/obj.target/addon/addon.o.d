cmd_Release/obj.target/addon/addon.o := g++ '-DNODE_GYP_MODULE_NAME=addon' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-DBUILDING_NODE_EXTENSION' -I/root/.node-gyp/8.9.1/include/node -I/root/.node-gyp/8.9.1/src -I/root/.node-gyp/8.9.1/deps/uv/include -I/root/.node-gyp/8.9.1/deps/v8/include  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter -O3 -fno-omit-frame-pointer -fno-rtti -fno-exceptions -std=gnu++0x -MMD -MF ./Release/.deps/Release/obj.target/addon/addon.o.d.raw   -c -o Release/obj.target/addon/addon.o ../addon.cc
Release/obj.target/addon/addon.o: ../addon.cc \
 /root/.node-gyp/8.9.1/include/node/node.h \
 /root/.node-gyp/8.9.1/include/node/v8.h \
 /root/.node-gyp/8.9.1/include/node/v8-version.h \
 /root/.node-gyp/8.9.1/include/node/v8config.h \
 /root/.node-gyp/8.9.1/include/node/node_version.h ../sha3.cc
../addon.cc:
/root/.node-gyp/8.9.1/include/node/node.h:
/root/.node-gyp/8.9.1/include/node/v8.h:
/root/.node-gyp/8.9.1/include/node/v8-version.h:
/root/.node-gyp/8.9.1/include/node/v8config.h:
/root/.node-gyp/8.9.1/include/node/node_version.h:
../sha3.cc:
