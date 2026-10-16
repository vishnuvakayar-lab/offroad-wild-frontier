var e,t,n,r,i,a,o,s,c,l=1e3,u=1001,d=1002,f=1003,p=1006,m=1008,h=1009,g=1012,_=1014,v=1015,y=1016,b=1017,x=1018,S=1020,C=1023,w=1026,T=1027,E=1028,D=1029,O=1030,ee=1031,k=1033,A=2300,j=2301,te=2302,M=2303,N=2400,P=2401,ne=2402,re=`srgb`,ie=`srgb-linear`,ae=`linear`,F=`srgb`,oe=7680,se=35048,ce=2e3;function le(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ue(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function de(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function fe(){let e=de(`canvas`);return e.style.display=`block`,e}var pe={};function me(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function he(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function I(...e){e=he(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function L(...e){e=he(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function R(...e){let t=e.join(` `);t in pe||(pe[t]=!0,I(...e))}function ge(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var _e={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},ve=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},ye=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),be=1234567,xe=Math.PI/180,Se=180/Math.PI;function Ce(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ye[e&255]+ye[e>>8&255]+ye[e>>16&255]+ye[e>>24&255]+`-`+ye[t&255]+ye[t>>8&255]+`-`+ye[t>>16&15|64]+ye[t>>24&255]+`-`+ye[n&63|128]+ye[n>>8&255]+`-`+ye[n>>16&255]+ye[n>>24&255]+ye[r&255]+ye[r>>8&255]+ye[r>>16&255]+ye[r>>24&255]).toLowerCase()}function z(e,t,n){return Math.max(t,Math.min(n,e))}function we(e,t){return(e%t+t)%t}function Te(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Ee(e,t,n){return e===t?0:(n-e)/(t-e)}function B(e,t,n){return(1-n)*e+n*t}function De(e,t,n,r){return B(e,t,1-Math.exp(-n*r))}function Oe(e,t=1){return t-Math.abs(we(e,t*2)-t)}function ke(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Ae(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function je(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Me(e,t){return e+Math.random()*(t-e)}function Ne(e){return e*(.5-Math.random())}function Pe(e){e!==void 0&&(be=e);let t=be+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function V(e){return e*xe}function Fe(e){return e*Se}function Ie(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Le(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function H(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function Re(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:I(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function U(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function W(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var ze={DEG2RAD:xe,RAD2DEG:Se,generateUUID:Ce,clamp:z,euclideanModulo:we,mapLinear:Te,inverseLerp:Ee,lerp:B,damp:De,pingpong:Oe,smoothstep:ke,smootherstep:Ae,randInt:je,randFloat:Me,randFloatSpread:Ne,seededRandom:Pe,degToRad:V,radToDeg:Fe,isPowerOfTwo:Ie,ceilPowerOfTwo:Le,floorPowerOfTwo:H,setQuaternionFromProperEuler:Re,normalize:W,denormalize:U};o=Symbol.iterator;var G=class{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[o](){yield this.x,yield this.y}};e=G,e.prototype.isVector2=!0;var Be=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:I(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(z(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};s=Symbol.iterator;var K=class{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(He.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(He.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ve.copy(this).projectOnVector(e),this.sub(Ve)}reflect(e){return this.sub(Ve.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(z(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[s](){yield this.x,yield this.y,yield this.z}};t=K,t.prototype.isVector3=!0;var Ve=new K,He=new Be,Ue=class{constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return R(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(We.makeScale(e,t)),this}rotate(e){return R(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(We.makeRotation(-e)),this}translate(e,t){return R(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(We.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};n=Ue,n.prototype.isMatrix3=!0;var We=new Ue,q=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ge=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function J(){let e={enabled:!0,workingColorSpace:ie,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Ke(e.r),e.g=Ke(e.g),e.b=Ke(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=qe(e.r),e.g=qe(e.g),e.b=qe(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?ae:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return R(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return R(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[ie]:{primaries:t,whitePoint:r,transfer:ae,toXYZ:q,fromXYZ:Ge,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:re},outputColorSpaceConfig:{drawingBufferColorSpace:re}},[re]:{primaries:t,whitePoint:r,transfer:F,toXYZ:q,fromXYZ:Ge,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:re}}}),e}var Y=J();function Ke(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function qe(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Je,Ye=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Je===void 0&&(Je=de(`canvas`)),Je.width=e.width,Je.height=e.height;let t=Je.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Je}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=de(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Ke(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Ke(t[e]/255)*255):t[e]=Ke(t[e]);return{data:t,width:e.width,height:e.height}}return I(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Xe=0,Ze=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Xe++}),this.uuid=Ce(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Qe(r[t].image)):e.push(Qe(r[t]))}else e=Qe(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Qe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Ye.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(I(`Texture: Unable to serialize Texture.`),{})}var $e=0,et=new K,tt=class e extends ve{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=u,i=u,a=p,o=m,s=C,c=h,l=e.DEFAULT_ANISOTROPY,d=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$e++}),this.uuid=Ce(),this.name=``,this.source=new Ze(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new G(0,0),this.repeat=new G(1,1),this.center=new G(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(et).x}get height(){return this.source.getSize(et).y}get depth(){return this.source.getSize(et).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){I(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?I(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case l:e.x-=Math.floor(e.x);break;case u:e.x=e.x<0?0:1;break;case d:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case l:e.y-=Math.floor(e.y);break;case u:e.y=e.y<0?0:1;break;case d:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};tt.DEFAULT_IMAGE=null,tt.DEFAULT_MAPPING=300,tt.DEFAULT_ANISOTROPY=1,c=Symbol.iterator;var nt=class{constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=z(this.x,e.x,t.x),this.y=z(this.y,e.y,t.y),this.z=z(this.z,e.z,t.z),this.w=z(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=z(this.x,e,t),this.y=z(this.y,e,t),this.z=z(this.z,e,t),this.w=z(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(z(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[c](){yield this.x,yield this.y,yield this.z,yield this.w}};r=nt,r.prototype.isVector4=!0;var rt=class extends ve{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:p,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t),this.textures=[];let r=new tt({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:p,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Ze(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},it=class extends rt{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},at=class extends tt{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=f,this.minFilter=f,this.wrapR=u,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},ot=class extends tt{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=f,this.minFilter=f,this.wrapR=u,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},st=class e{constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/ct.setFromMatrixColumn(e,0).length(),i=1/ct.setFromMatrixColumn(e,1).length(),a=1/ct.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ut,e,dt)}lookAt(e,t,n){let r=this.elements;return mt.subVectors(e,t),mt.lengthSq()===0&&(mt.z=1),mt.normalize(),ft.crossVectors(n,mt),ft.lengthSq()===0&&(Math.abs(n.z)===1?mt.x+=1e-4:mt.z+=1e-4,mt.normalize(),ft.crossVectors(n,mt)),ft.normalize(),pt.crossVectors(mt,ft),r[0]=ft.x,r[4]=pt.x,r[8]=mt.x,r[1]=ft.y,r[5]=pt.y,r[9]=mt.y,r[2]=ft.z,r[6]=pt.z,r[10]=mt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],k=r[6],A=r[10],j=r[14],te=r[3],M=r[7],N=r[11],P=r[15];return i[0]=a*x+o*T+s*ee+c*te,i[4]=a*S+o*E+s*k+c*M,i[8]=a*C+o*D+s*A+c*N,i[12]=a*w+o*O+s*j+c*P,i[1]=l*x+u*T+d*ee+f*te,i[5]=l*S+u*E+d*k+f*M,i[9]=l*C+u*D+d*A+f*N,i[13]=l*w+u*O+d*j+f*P,i[2]=p*x+m*T+h*ee+g*te,i[6]=p*S+m*E+h*k+g*M,i[10]=p*C+m*D+h*A+g*N,i[14]=p*w+m*O+h*j+g*P,i[3]=_*x+v*T+y*ee+b*te,i[7]=_*S+v*E+y*k+b*M,i[11]=_*C+v*D+y*A+b*N,i[15]=_*w+v*O+y*j+b*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let k=1/ee;return e[0]=(o*O-s*D+c*E)*k,e[1]=(r*D-n*O-i*E)*k,e[2]=(m*S-h*x+g*b)*k,e[3]=(d*x-u*S-f*b)*k,e[4]=(s*T-a*O-c*w)*k,e[5]=(t*O-r*T+i*w)*k,e[6]=(h*y-p*S-g*v)*k,e[7]=(l*S-d*y+f*v)*k,e[8]=(a*D-o*T+c*C)*k,e[9]=(n*T-t*D-i*C)*k,e[10]=(p*x-m*y+g*_)*k,e[11]=(u*y-l*x-f*_)*k,e[12]=(o*w-a*E-s*C)*k,e[13]=(t*E-n*w+r*C)*k,e[14]=(m*v-p*b-h*_)*k,e[15]=(l*b-u*v+d*_)*k,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=ct.set(r[0],r[1],r[2]).length(),o=ct.set(r[4],r[5],r[6]).length(),s=ct.set(r[8],r[9],r[10]).length();i<0&&(a=-a),lt.copy(this);let c=1/a,l=1/o,u=1/s;return lt.elements[0]*=c,lt.elements[1]*=c,lt.elements[2]*=c,lt.elements[4]*=l,lt.elements[5]*=l,lt.elements[6]*=l,lt.elements[8]*=u,lt.elements[9]*=u,lt.elements[10]*=u,t.setFromRotationMatrix(lt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=ce,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=ce,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};i=st,i.prototype.isMatrix4=!0;var ct=new K,lt=new st,ut=new K(0,0,0),dt=new K(1,1,1),ft=new K,pt=new K,mt=new K,ht=new st,gt=new Be,_t=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(z(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-z(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(z(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-z(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(z(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-z(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:I(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ht.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ht,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return gt.setFromEuler(this),this.setFromQuaternion(gt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};_t.DEFAULT_ORDER=`XYZ`;var vt=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},yt=0,bt=new K,xt=new Be,St=new st,Ct=new K,wt=new K,Tt=new K,Et=new Be,Dt=new K(1,0,0),Ot=new K(0,1,0),kt=new K(0,0,1),At={type:`added`},jt={type:`removed`},Mt={type:`childadded`,child:null},Nt={type:`childremoved`,child:null},Pt=class e extends ve{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:yt++}),this.uuid=Ce(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new K,n=new _t,r=new Be,i=new K(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new st},normalMatrix:{value:new Ue}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vt,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xt.setFromAxisAngle(e,t),this.quaternion.multiply(xt),this}rotateOnWorldAxis(e,t){return xt.setFromAxisAngle(e,t),this.quaternion.premultiply(xt),this}rotateX(e){return this.rotateOnAxis(Dt,e)}rotateY(e){return this.rotateOnAxis(Ot,e)}rotateZ(e){return this.rotateOnAxis(kt,e)}translateOnAxis(e,t){return bt.copy(e).applyQuaternion(this.quaternion),this.position.add(bt.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Dt,e)}translateY(e){return this.translateOnAxis(Ot,e)}translateZ(e){return this.translateOnAxis(kt,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(St.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ct.copy(e):Ct.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),wt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?St.lookAt(wt,Ct,this.up):St.lookAt(Ct,wt,this.up),this.quaternion.setFromRotationMatrix(St),r&&(St.extractRotation(r.matrixWorld),xt.setFromRotationMatrix(St),this.quaternion.premultiply(xt.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(L(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(At),Mt.child=e,this.dispatchEvent(Mt),Mt.child=null):L(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jt),Nt.child=e,this.dispatchEvent(Nt),Nt.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),St.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),St.multiply(e.parent.matrixWorld)),e.applyMatrix4(St),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(At),Mt.child=e,this.dispatchEvent(Mt),Mt.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wt,e,Tt),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wt,Et,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Pt.DEFAULT_UP=new K(0,1,0),Pt.DEFAULT_MATRIX_AUTO_UPDATE=!0,Pt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ft=class extends Pt{constructor(){super(),this.isGroup=!0,this.type=`Group`}},It={type:`move`},Lt=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ft,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ft,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ft,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(It)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ft;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Rt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zt={h:0,s:0,l:0},Bt={h:0,s:0,l:0};function Vt(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var X=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=re){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Y.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Y.workingColorSpace){return this.r=e,this.g=t,this.b=n,Y.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Y.workingColorSpace){if(e=we(e,1),t=z(t,0,1),n=z(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Vt(i,r,e+1/3),this.g=Vt(i,r,e),this.b=Vt(i,r,e-1/3)}return Y.colorSpaceToWorking(this,r),this}setStyle(e,t=re){function n(t){t!==void 0&&parseFloat(t)<1&&I(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:I(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);I(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=re){let n=Rt[e.toLowerCase()];return n===void 0?I(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ke(e.r),this.g=Ke(e.g),this.b=Ke(e.b),this}copyLinearToSRGB(e){return this.r=qe(e.r),this.g=qe(e.g),this.b=qe(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=re){return Y.workingToColorSpace(Ht.copy(this),e),Math.round(z(Ht.r*255,0,255))*65536+Math.round(z(Ht.g*255,0,255))*256+Math.round(z(Ht.b*255,0,255))}getHexString(e=re){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Y.workingColorSpace){Y.workingToColorSpace(Ht.copy(this),t);let n=Ht.r,r=Ht.g,i=Ht.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Y.workingColorSpace){return Y.workingToColorSpace(Ht.copy(this),t),e.r=Ht.r,e.g=Ht.g,e.b=Ht.b,e}getStyle(e=re){Y.workingToColorSpace(Ht.copy(this),e);let t=Ht.r,n=Ht.g,r=Ht.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(zt),this.setHSL(zt.h+e,zt.s+t,zt.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(zt),e.getHSL(Bt);let n=B(zt.h,Bt.h,t),r=B(zt.s,Bt.s,t),i=B(zt.l,Bt.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ht=new X;X.NAMES=Rt;var Ut=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new X(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Wt=class extends Pt{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _t,this.environmentIntensity=1,this.environmentRotation=new _t,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Gt=new K,Kt=new K,qt=new K,Jt=new K,Yt=new K,Xt=new K,Zt=new K,Qt=new K,$t=new K,en=new K,tn=new nt,nn=new nt,rn=new nt,an=class e{constructor(e=new K,t=new K,n=new K){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Gt.subVectors(e,t),r.cross(Gt);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Gt.subVectors(r,t),Kt.subVectors(n,t),qt.subVectors(e,t);let a=Gt.dot(Gt),o=Gt.dot(Kt),s=Gt.dot(qt),c=Kt.dot(Kt),l=Kt.dot(qt),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Jt)!==null&&Jt.x>=0&&Jt.y>=0&&Jt.x+Jt.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Jt)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Jt.x),s.addScaledVector(a,Jt.y),s.addScaledVector(o,Jt.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return tn.setScalar(0),nn.setScalar(0),rn.setScalar(0),tn.fromBufferAttribute(e,t),nn.fromBufferAttribute(e,n),rn.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(tn,i.x),a.addScaledVector(nn,i.y),a.addScaledVector(rn,i.z),a}static isFrontFacing(e,t,n,r){return Gt.subVectors(n,t),Kt.subVectors(e,t),Gt.cross(Kt).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gt.subVectors(this.c,this.b),Kt.subVectors(this.a,this.b),Gt.cross(Kt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Yt.subVectors(r,n),Xt.subVectors(i,n),Qt.subVectors(e,n);let s=Yt.dot(Qt),c=Xt.dot(Qt);if(s<=0&&c<=0)return t.copy(n);$t.subVectors(e,r);let l=Yt.dot($t),u=Xt.dot($t);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Yt,a);en.subVectors(e,i);let f=Yt.dot(en),p=Xt.dot(en);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Xt,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Zt.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Zt,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Yt,a).addScaledVector(Xt,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},on=class{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,cn):cn.fromBufferAttribute(r,t),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),ln.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),ln.copy(e.boundingBox)),ln.applyMatrix4(e.matrixWorld),this.union(ln)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gn),_n.subVectors(this.max,gn),un.subVectors(e.a,gn),dn.subVectors(e.b,gn),fn.subVectors(e.c,gn),pn.subVectors(dn,un),mn.subVectors(fn,dn),hn.subVectors(un,fn);let t=[0,-pn.z,pn.y,0,-mn.z,mn.y,0,-hn.z,hn.y,pn.z,0,-pn.x,mn.z,0,-mn.x,hn.z,0,-hn.x,-pn.y,pn.x,0,-mn.y,mn.x,0,-hn.y,hn.x,0];return!bn(t,un,dn,fn,_n)||(t=[1,0,0,0,1,0,0,0,1],!bn(t,un,dn,fn,_n))?!1:(vn.crossVectors(pn,mn),t=[vn.x,vn.y,vn.z],bn(t,un,dn,fn,_n))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(sn)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},sn=[new K,new K,new K,new K,new K,new K,new K,new K],cn=new K,ln=new on,un=new K,dn=new K,fn=new K,pn=new K,mn=new K,hn=new K,gn=new K,_n=new K,vn=new K,yn=new K;function bn(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){yn.fromArray(e,a);let o=i.x*Math.abs(yn.x)+i.y*Math.abs(yn.y)+i.z*Math.abs(yn.z),s=t.dot(yn),c=n.dot(yn),l=r.dot(yn);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var xn=new K,Sn=new G,Cn=0,wn=class extends ve{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cn++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=v,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Sn.fromBufferAttribute(this,t),Sn.applyMatrix3(e),this.setXY(t,Sn.x,Sn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyMatrix3(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyMatrix4(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.applyNormalMatrix(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)xn.fromBufferAttribute(this,t),xn.transformDirection(e),this.setXYZ(t,xn.x,xn.y,xn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=U(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=W(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=U(t,this.array)),t}setX(e,t){return this.normalized&&(t=W(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=U(t,this.array)),t}setY(e,t){return this.normalized&&(t=W(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=U(t,this.array)),t}setZ(e,t){return this.normalized&&(t=W(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=U(t,this.array)),t}setW(e,t){return this.normalized&&(t=W(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=W(t,this.array),n=W(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=W(t,this.array),n=W(n,this.array),r=W(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=W(t,this.array),n=W(n,this.array),r=W(r,this.array),i=W(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Tn=class extends wn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},En=class extends wn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Dn=class extends wn{constructor(e,t,n){super(new Float32Array(e),t,n)}},On=new on,kn=new K,An=new K,jn=class{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?On.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;kn.subVectors(e,this.center);let t=kn.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(kn,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(An.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(kn.copy(e.center).add(An)),this.expandByPoint(kn.copy(e.center).sub(An))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Mn=0,Nn=new st,Pn=new Pt,Fn=new K,In=new on,Ln=new on,Rn=new K,zn=class e extends ve{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mn++}),this.uuid=Ce(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(le(e)?En:Tn)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new Ue().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,t,n){return Nn.makeTranslation(e,t,n),this.applyMatrix4(Nn),this}scale(e,t,n){return Nn.makeScale(e,t,n),this.applyMatrix4(Nn),this}lookAt(e){return Pn.lookAt(e),Pn.updateMatrix(),this.applyMatrix4(Pn.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fn).negate(),this.translate(Fn.x,Fn.y,Fn.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Dn(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&I(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new on);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)L(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];In.setFromBufferAttribute(n),this.morphTargetsRelative?(Rn.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(Rn),Rn.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(Rn)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&L(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new jn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)L(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new K,1/0);else if(e){let n=this.boundingSphere.center;if(In.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ln.setFromBufferAttribute(n),this.morphTargetsRelative?(Rn.addVectors(In.min,Ln.min),In.expandByPoint(Rn),Rn.addVectors(In.max,Ln.max),In.expandByPoint(Rn)):(In.expandByPoint(Ln.min),In.expandByPoint(Ln.max))}In.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Rn.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Rn));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Rn.fromBufferAttribute(a,t),o&&(Fn.fromBufferAttribute(e,t),Rn.add(Fn)),r=Math.max(r,n.distanceToSquared(Rn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&L(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){L(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new wn(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new K,s[e]=new K;let c=new K,l=new K,u=new K,d=new G,f=new G,p=new G,m=new K,h=new K;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new K,y=new K,b=new K,x=new K;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new wn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new K,i=new K,a=new K,o=new K,s=new K,c=new K,l=new K,u=new K;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Rn.fromBufferAttribute(e,t),Rn.normalize(),e.setXYZ(t,Rn.x,Rn.y,Rn.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new wn(a,r,i)}if(this.index===null)return I(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Bn=new K,Vn=new K,Hn=new Ue,Un=class{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Bn.subVectors(n,t).cross(Vn.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Bn),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Hn.getNormalMatrix(e),r=this.coplanarPoint(Bn).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Wn=0,Gn=class extends ve{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wn++}),this.uuid=Ce(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new X(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=oe,this.stencilZFail=oe,this.stencilZPass=oe,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){I(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?I(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new X().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Un().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new G().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new G().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Kn=new K,qn=new K,Jn=new K,Yn=new K,Xn=class{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kn.copy(this.origin).addScaledVector(this.direction,t),Kn.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){qn.copy(e).add(t).multiplyScalar(.5),Jn.copy(t).sub(e).normalize(),Yn.copy(this.origin).sub(qn);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Jn),o=Yn.dot(this.direction),s=-Yn.dot(Jn),c=Yn.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(qn).addScaledVector(Jn,d),f}intersectSphere(e,t){if(e.radius<0)return null;Kn.subVectors(e.center,this.origin);let n=Kn.dot(this.direction),r=Kn.dot(Kn)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Kn)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,ee,k,A,j,te;if(y>=b&&y>=x?(w=s,D=u,k=p,te=g,s>=0?(S=c,C=l,T=d,E=f,O=m,ee=h,A=_,j=v):(S=l,C=c,T=f,E=d,O=h,ee=m,A=v,j=_)):b>=x?(w=c,D=d,k=m,te=_,c>=0?(S=l,C=s,T=f,E=u,O=h,ee=p,A=v,j=g):(S=s,C=l,T=u,E=f,O=p,ee=h,A=g,j=v)):(w=l,D=f,k=h,te=v,l>=0?(S=s,C=c,T=u,E=d,O=p,ee=m,A=g,j=_):(S=c,C=s,T=d,E=u,O=m,ee=p,A=_,j=g)),w===0)return null;let M=S/w,N=C/w,P=1/w,ne=T-M*D,re=E-N*D,ie=O-M*k,ae=ee-N*k,F=A-M*te,oe=j-N*te,se=F*ae-oe*ie,ce=ne*oe-re*F,le=ie*re-ae*ne;if(r){if(se<0||ce<0||le<0)return null}else if((se<0||ce<0||le<0)&&(se>0||ce>0||le>0))return null;let ue=se+ce+le;if(ue===0)return null;let de=P*(se*D+ce*k+le*te);return(ue>0?de<0:de>0)?null:this.at(de/ue,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Zn=class extends Gn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new X(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _t,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Qn=new st,$n=new Xn,er=new jn,tr=new K,nr=new K,rr=new K,ir=new K,ar=new K,or=new K,sr=new K,cr=new K,lr=class extends Pt{constructor(e=new zn,t=new Zn){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){or.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(ar.fromBufferAttribute(s,e),a?or.addScaledVector(ar,r):or.addScaledVector(ar.sub(t),r))}t.add(or)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(i),$n.copy(e.ray).recast(e.near),!(er.containsPoint($n.origin)===!1&&($n.intersectSphere(er,tr)===null||$n.origin.distanceToSquared(tr)>(e.far-e.near)**2))&&(Qn.copy(i).invert(),$n.copy(e.ray).applyMatrix4(Qn),(n.boundingBox===null||$n.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,$n)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=dr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=dr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=dr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=dr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ur(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;cr.copy(s),cr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(cr);return l<n.near||l>n.far?null:{distance:l,point:cr.clone(),object:e}}function dr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,nr),e.getVertexPosition(c,rr),e.getVertexPosition(l,ir);let u=ur(e,t,n,r,nr,rr,ir,sr);if(u){let e=new K;an.getBarycoord(sr,nr,rr,ir,e),i&&(u.uv=an.getInterpolatedAttribute(i,s,c,l,e,new G)),a&&(u.uv1=an.getInterpolatedAttribute(a,s,c,l,e,new G)),o&&(u.normal=an.getInterpolatedAttribute(o,s,c,l,e,new K),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new K,materialIndex:0};an.getNormal(nr,rr,ir,t.normal),u.face=t,u.barycoord=e}return u}var fr=class extends tt{constructor(e=null,t=1,n=1,r,i,a,o,s,c=f,l=f,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},pr=class extends wn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},mr=new st,hr=new st,gr=[],_r=new on,vr=new st,yr=new lr,br=new jn,xr=class extends lr{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new pr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,vr)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new on),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,mr),_r.copy(e.boundingBox).applyMatrix4(mr),this.boundingBox.union(_r)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new jn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,mr),br.copy(e.boundingSphere).applyMatrix4(mr),this.boundingSphere.union(br)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(yr.geometry=this.geometry,yr.material=this.material,yr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),br.copy(this.boundingSphere),br.applyMatrix4(n),e.ray.intersectsSphere(br)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,mr),hr.multiplyMatrices(n,mr),yr.matrixWorld=hr,yr.raycast(e,gr);for(let e=0,n=gr.length;e<n;e++){let n=gr[e];n.instanceId=i,n.object=this,t.push(n)}gr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new pr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new fr(new Float32Array(r*this.count),r,this.count,E,v));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Sr=new jn,Cr=new G(.5,.5),wr=new K,Tr=class{constructor(e=new Un,t=new Un,n=new Un,r=new Un,i=new Un,a=new Un){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ce,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Sr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Sr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Sr)}intersectsSprite(e){return Sr.center.set(0,0,0),Sr.radius=.7071067811865476+Cr.distanceTo(e.center),Sr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Sr)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(wr.x=r.normal.x>0?e.max.x:e.min.x,wr.y=r.normal.y>0?e.max.y:e.min.y,wr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(wr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Er=class extends Gn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new X(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Dr=new K,Or=new K,kr=new st,Ar=new Xn,jr=new jn,Mr=new K,Nr=new K,Pr=class extends Pt{constructor(e=new zn,t=new Er){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)Dr.fromBufferAttribute(t,e-1),Or.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=Dr.distanceTo(Or);e.setAttribute(`lineDistance`,new Dn(n,1))}else I(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(r),jr.radius+=i,e.ray.intersectsSphere(jr)===!1)return;kr.copy(r).invert(),Ar.copy(e.ray).applyMatrix4(kr);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=Fr(this,e,Ar,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=Fr(this,e,Ar,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=Fr(this,e,Ar,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=Fr(this,e,Ar,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Fr(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(Dr.fromBufferAttribute(s,i),Or.fromBufferAttribute(s,a),n.distanceSqToSegment(Dr,Or,Mr,Nr)>r)return;Mr.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(Mr);if(!(c<t.near||c>t.far))return{distance:c,point:Nr.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var Ir=new K,Lr=new K,Rr=class extends Pr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)Ir.fromBufferAttribute(t,e),Lr.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+Ir.distanceTo(Lr);e.setAttribute(`lineDistance`,new Dn(n,1))}else I(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},zr=class extends Gn{constructor(e){super(),this.isPointsMaterial=!0,this.type=`PointsMaterial`,this.color=new X(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Br=new st,Vr=new Xn,Hr=new jn,Ur=new K,Wr=class extends Pt{constructor(e=new zn,t=new zr){super(),this.isPoints=!0,this.type=`Points`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Hr.copy(n.boundingSphere),Hr.applyMatrix4(r),Hr.radius+=i,e.ray.intersectsSphere(Hr)===!1)return;Br.copy(r).invert(),Vr.copy(e.ray).applyMatrix4(Br);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=n.index,l=n.attributes.position;if(c!==null){let n=Math.max(0,a.start),i=Math.min(c.count,a.start+a.count);for(let a=n,o=i;a<o;a++){let n=c.getX(a);Ur.fromBufferAttribute(l,n),Gr(Ur,n,s,r,e,t,this)}}else{let n=Math.max(0,a.start),i=Math.min(l.count,a.start+a.count);for(let a=n,o=i;a<o;a++)Ur.fromBufferAttribute(l,a),Gr(Ur,a,s,r,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function Gr(e,t,n,r,i,a,o){let s=Vr.distanceSqToPoint(e);if(s<n){let n=new K;Vr.closestPointToPoint(e,n),n.applyMatrix4(r);let c=i.ray.origin.distanceTo(n);if(c<i.near||c>i.far)return;a.push({distance:c,distanceToRay:Math.sqrt(s),point:n,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Kr=class extends tt{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},qr=class extends tt{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Jr=class extends tt{constructor(e,t,n=_,r,i,a,o=f,s=f,c,l=w,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ze(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Yr=class extends Jr{constructor(e,t=_,n=301,r,i,a=f,o=f,s,c=w){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Xr=class extends tt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Zr=class e extends zn{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Dn(c,3)),this.setAttribute(`normal`,new Dn(l,3)),this.setAttribute(`uv`,new Dn(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new K;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Qr=class e extends zn{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new K,l=new G;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Dn(a,3)),this.setAttribute(`normal`,new Dn(o,3)),this.setAttribute(`uv`,new Dn(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},$r=class e extends zn{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Dn(u,3)),this.setAttribute(`normal`,new Dn(d,3)),this.setAttribute(`uv`,new Dn(f,2));function _(){let a=new K,_=new K,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new G,m=new K,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ei=class e extends $r{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ti=class e extends zn{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Dn(i,3)),this.setAttribute(`normal`,new Dn(i.slice(),3)),this.setAttribute(`uv`,new Dn(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new K,r=new K,i=new K;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new K;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new K;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new K,t=new K,n=new K,r=new K,o=new G,s=new G,c=new G;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},ni=class e extends ti{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},ri=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){I(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new G:new K);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new K,r=[],i=[],a=[],o=new K,s=new st;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new K)}i[0]=new K,a[0]=new K;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(z(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(z(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},ii=class extends ri{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new G){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ai=class extends ii{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function oi(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var si=new K,ci=new K,li=new oi,ui=new oi,di=new oi,fi=class extends ri{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new K){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(ci.subVectors(r[0],r[1]).add(r[0]),c=ci);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(si.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=si),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),li.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),ui.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),di.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(li.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),ui.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),di.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(li.calc(s),ui.calc(s),di.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new K().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function pi(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function mi(e,t){let n=1-e;return n*n*t}function hi(e,t){return 2*(1-e)*e*t}function gi(e,t){return e*e*t}function _i(e,t,n,r){return mi(e,t)+hi(e,n)+gi(e,r)}function vi(e,t){let n=1-e;return n*n*n*t}function yi(e,t){let n=1-e;return 3*n*n*e*t}function bi(e,t){return 3*(1-e)*e*e*t}function xi(e,t){return e*e*e*t}function Si(e,t,n,r,i){return vi(e,t)+yi(e,n)+bi(e,r)+xi(e,i)}var Ci=class extends ri{constructor(e=new G,t=new G,n=new G,r=new G){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Si(e,r.x,i.x,a.x,o.x),Si(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},wi=class extends ri{constructor(e=new K,t=new K,n=new K,r=new K){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new K){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(Si(e,r.x,i.x,a.x,o.x),Si(e,r.y,i.y,a.y,o.y),Si(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ti=class extends ri{constructor(e=new G,t=new G){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new G){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new G){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ei=class extends ri{constructor(e=new K,t=new K){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new K){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new K){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Di=class extends ri{constructor(e=new G,t=new G,n=new G){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new G){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(_i(e,r.x,i.x,a.x),_i(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Oi=class extends ri{constructor(e=new K,t=new K,n=new K){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new K){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(_i(e,r.x,i.x,a.x),_i(e,r.y,i.y,a.y),_i(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ki=class extends ri{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new G){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(pi(o,s.x,c.x,l.x,u.x),pi(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new G().fromArray(n))}return this}},Ai=Object.freeze({__proto__:null,ArcCurve:ai,CatmullRomCurve3:fi,CubicBezierCurve:Ci,CubicBezierCurve3:wi,EllipseCurve:ii,LineCurve:Ti,LineCurve3:Ei,QuadraticBezierCurve:Di,QuadraticBezierCurve3:Oi,SplineCurve:ki}),ji=class extends ri{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new Ai[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new Ai[n.type]().fromJSON(n))}return this}},Mi=class extends ji{constructor(e){super(),this.type=`Path`,this.currentPoint=new G,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ti(this.currentPoint.clone(),new G(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new Di(this.currentPoint.clone(),new G(e,t),new G(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new Ci(this.currentPoint.clone(),new G(e,t),new G(n,r),new G(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new ki([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new ii(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Ni=class extends Mi{constructor(e){super(e),this.uuid=Ce(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new Mi().fromJSON(n))}return this}};function Pi(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=Fi(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Hi(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Li(a,o,n,s,c,l,0),o}function Fi(e,t,n,r,i){let a;if(i===fa(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=la(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=la(i/r|0,e[i],e[i+1],a);return a&&ta(a,a.next)&&(ua(a),a=a.next),a}function Ii(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(ta(n,n.next)||ea(n.prev,n,n.next)===0)){if(ua(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Li(e,t,n,r,i,a,o){if(!e)return;!o&&a&&qi(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?zi(e,r,i,a):Ri(e))t.push(c.i,e.i,l.i),ua(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Bi(Ii(e),t),Li(e,t,n,r,i,a,2)):o===2&&Vi(e,t,n,r,i,a):Li(Ii(e),t,n,r,i,a,1);break}}}function Ri(e){let t=e.prev,n=e,r=e.next;if(ea(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Qi(i,s,a,c,o,l,m.x,m.y)&&ea(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function zi(e,t,n,r){let i=e.prev,a=e,o=e.next;if(ea(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=Yi(p,m,t,n,r),v=Yi(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Qi(s,u,c,d,l,f,y.x,y.y)&&ea(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Qi(s,u,c,d,l,f,b.x,b.y)&&ea(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Qi(s,u,c,d,l,f,y.x,y.y)&&ea(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Qi(s,u,c,d,l,f,b.x,b.y)&&ea(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Bi(e,t){let n=e;do{let r=n.prev,i=n.next.next;!ta(r,i)&&na(r,n,n.next,i)&&oa(r,i)&&oa(i,r)&&(t.push(r.i,n.i,i.i),ua(n),ua(n.next),n=e=i),n=n.next}while(n!==e);return Ii(n)}function Vi(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&$i(o,e)){let s=ca(o,e);o=Ii(o,o.next),s=Ii(s,s.next),Li(o,t,n,r,i,a,0),Li(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Hi(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=Fi(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Xi(o))}i.sort(Ui);for(let e=0;e<i.length;e++)n=Wi(i[e],n);return n}function Ui(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Wi(e,t){let n=Gi(e,t);if(!n)return t;let r=ca(n,e);return Ii(r,r.next),Ii(n,n.next)}function Gi(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(ta(e,n))return n;do{if(ta(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&Zi(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);oa(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Ki(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Ki(e,t){return ea(e.prev,e,t.prev)<0&&ea(t.next,e,e.next)<0}function qi(e,t,n,r){let i=e;do i.z===0&&(i.z=Yi(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Ji(i)}function Ji(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function Yi(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Xi(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function Zi(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Qi(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&Zi(e,t,n,r,i,a,o,s)}function $i(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!aa(e,t)&&(oa(e,t)&&oa(t,e)&&sa(e,t)&&(ea(e.prev,e,t.prev)||ea(e,t.prev,t))||ta(e,t)&&ea(e.prev,e,e.next)>0&&ea(t.prev,t,t.next)>0)}function ea(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function ta(e,t){return e.x===t.x&&e.y===t.y}function na(e,t,n,r){let i=ia(ea(e,t,n)),a=ia(ea(e,t,r)),o=ia(ea(n,r,e)),s=ia(ea(n,r,t));return!!(i!==a&&o!==s||i===0&&ra(e,n,t)||a===0&&ra(e,r,t)||o===0&&ra(n,e,r)||s===0&&ra(n,t,r))}function ra(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function ia(e){return e>0?1:e<0?-1:0}function aa(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&na(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function oa(e,t){return ea(e.prev,e,e.next)<0?ea(e,t,e.next)>=0&&ea(e,e.prev,t)>=0:ea(e,t,e.prev)<0||ea(e,e.next,t)<0}function sa(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function ca(e,t){let n=da(e.i,e.x,e.y),r=da(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function la(e,t,n,r){let i=da(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function ua(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function da(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function fa(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var pa=class{static triangulate(e,t,n=2){return Pi(e,t,n)}},ma=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];ha(e),ga(n,e);let a=e.length;t.forEach(ha);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,ga(n,t[e]);let o=pa.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function ha(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function ga(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var _a=class e extends zn{constructor(e=new Ni([new G(.5,.5),new G(-.5,.5),new G(-.5,-.5),new G(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new Dn(r,3)),this.setAttribute(`uv`,new Dn(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?va:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new K,b=new K,x=new K}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!ma.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];ma.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||L(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let ee=C.length;function k(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new G(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new G(r/a,i/a)}let A=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),A[e]=k(D[e],D[n],D[r]);let j=[],te,M=A.concat();for(let e=0,t=E;e<t;e++){let t=w[e];te=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),te[e]=k(t[e],t[r],t[i]);j.push(te),M=M.concat(te)}let N;if(p===0)N=ma.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],A[t],a);F(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];te=j[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],te[e],a);F(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}N=ma.triangulateShape(e,t)}let P=N.length,ne=d+f;for(let e=0;e<ee;e++){let t=l?O(C[e],M[e],ne):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),F(x.x,x.y,x.z)):F(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<ee;t++){let n=l?O(C[t],M[t],ne):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),F(x.x,x.y,x.z)):F(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],A[e],r);F(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];te=j[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],te[e],r);_?F(i.x,i.y+g[s-1].y,g[s-1].x+n):F(i.x,i.y,c+n)}}}re(),ie();function re(){let e=r.length/3;if(l){let e=0,t=ee*e;for(let e=0;e<P;e++){let n=N[e];oe(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=ee*e;for(let e=0;e<P;e++){let n=N[e];oe(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<P;e++){let t=N[e];oe(t[2],t[1],t[0])}for(let e=0;e<P;e++){let t=N[e];oe(t[0]+ee*s,t[1]+ee*s,t[2]+ee*s)}}n.addGroup(e,r.length/3-e,0)}function ie(){let e=r.length/3,t=0;ae(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];ae(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function ae(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=ee*e,a=ee*(e+1);se(t+r+n,t+i+n,t+i+a,t+r+a)}}}function F(e,t,n){a.push(e),a.push(t),a.push(n)}function oe(e,t,i){ce(e),ce(t),ce(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);le(o[0]),le(o[1]),le(o[2])}function se(e,t,i,a){ce(e),ce(t),ce(a),ce(t),ce(i),ce(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);le(s[0]),le(s[1]),le(s[3]),le(s[1]),le(s[2]),le(s[3])}function ce(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function le(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ya(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new Ai[i.type]().fromJSON(i)),new e(r,t.options)}},va={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new G(a,o),new G(s,c),new G(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new G(o,1-c),new G(l,1-d),new G(f,1-m),new G(h,1-_)]:[new G(s,1-c),new G(u,1-d),new G(p,1-m),new G(g,1-_)]}};function ya(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var ba=class e extends ti{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},xa=class e extends zn{constructor(e=[new G(0,-.5),new G(.5,0),new G(0,.5)],t=12,n=0,r=Math.PI*2){super(),this.type=`LatheGeometry`,this.parameters={points:e,segments:t,phiStart:n,phiLength:r},t=Math.floor(t),r=z(r,0,Math.PI*2);let i=[],a=[],o=[],s=[],c=[],l=1/t,u=new K,d=new G,f=new K,p=new K,m=new K,h=0,g=0;for(let t=0;t<=e.length-1;t++)switch(t){case 0:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,m.copy(f),f.normalize(),s.push(f.x,f.y,f.z);break;case e.length-1:s.push(m.x,m.y,m.z);break;default:h=e[t+1].x-e[t].x,g=e[t+1].y-e[t].y,f.x=g*1,f.y=-h,f.z=g*0,p.copy(f),f.x+=m.x,f.y+=m.y,f.z+=m.z,f.normalize(),s.push(f.x,f.y,f.z),m.copy(p)}for(let i=0;i<=t;i++){let f=n+i*l*r,p=Math.sin(f),m=Math.cos(f);for(let n=0;n<=e.length-1;n++){u.x=e[n].x*p,u.y=e[n].y,u.z=e[n].x*m,a.push(u.x,u.y,u.z),d.x=i/t,d.y=n/(e.length-1),o.push(d.x,d.y);let r=s[3*n+0]*p,l=s[3*n+1],f=s[3*n+0]*m;c.push(r,l,f)}}for(let n=0;n<t;n++)for(let t=0;t<e.length-1;t++){let r=t+n*e.length,a=r,o=r+e.length,s=r+e.length+1,c=r+1;i.push(a,o,c),i.push(s,c,o)}this.setIndex(i),this.setAttribute(`position`,new Dn(a,3)),this.setAttribute(`uv`,new Dn(o,2)),this.setAttribute(`normal`,new Dn(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.points,t.segments,t.phiStart,t.phiLength)}},Sa=class e extends zn{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Dn(p,3)),this.setAttribute(`normal`,new Dn(m,3)),this.setAttribute(`uv`,new Dn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Ca=class e extends zn{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new K,p=new G;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Dn(s,3)),this.setAttribute(`normal`,new Dn(c,3)),this.setAttribute(`uv`,new Dn(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},wa=class e extends zn{constructor(e=new Ni([new G(0,.5),new G(-.5,-.5),new G(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new Dn(r,3)),this.setAttribute(`normal`,new Dn(i,3)),this.setAttribute(`uv`,new Dn(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;ma.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];ma.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=ma.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Ta(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function Ta(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var Ea=class e extends zn{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new K,d=new K,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Dn(p,3)),this.setAttribute(`normal`,new Dn(m,3)),this.setAttribute(`uv`,new Dn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Da=class e extends ti{constructor(e=1,t=0){super([1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],e,t),this.type=`TetrahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Oa=class e extends zn{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new K,f=new K,p=new K;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Dn(c,3)),this.setAttribute(`normal`,new Dn(l,3)),this.setAttribute(`uv`,new Dn(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},ka=class e extends zn{constructor(e=new Oi(new K(-1,-1,0),new K(-1,1,0),new K(1,1,0)),t=64,n=1,r=8,i=!1){super(),this.type=`TubeGeometry`,this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:r,closed:i};let a=e.computeFrenetFrames(t,i);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new K,s=new K,c=new G,l=new K,u=[],d=[],f=[],p=[];m(),this.setIndex(p),this.setAttribute(`position`,new Dn(u,3)),this.setAttribute(`normal`,new Dn(d,3)),this.setAttribute(`uv`,new Dn(f,2));function m(){for(let e=0;e<t;e++)h(e);h(i===!1?t:0),_(),g()}function h(i){l=e.getPointAt(i/t,l);let c=a.normals[i],f=a.binormals[i];for(let e=0;e<=r;e++){let t=e/r*Math.PI*2,i=Math.sin(t),a=-Math.cos(t);s.x=a*c.x+i*f.x,s.y=a*c.y+i*f.y,s.z=a*c.z+i*f.z,s.normalize(),d.push(s.x,s.y,s.z),o.x=l.x+n*s.x,o.y=l.y+n*s.y,o.z=l.z+n*s.z,u.push(o.x,o.y,o.z)}}function g(){for(let e=1;e<=t;e++)for(let t=1;t<=r;t++){let n=(r+1)*(e-1)+(t-1),i=(r+1)*e+(t-1),a=(r+1)*e+t,o=(r+1)*(e-1)+t;p.push(n,i,o),p.push(i,a,o)}}function _(){for(let e=0;e<=t;e++)for(let n=0;n<=r;n++)c.x=e/t,c.y=n/r,f.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(t){return new e(new Ai[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};function Aa(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Ma(i))i.isRenderTargetTexture?(I(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Ma(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function ja(e){let t={};for(let n=0;n<e.length;n++){let r=Aa(e[n]);for(let e in r)t[e]=r[e]}return t}function Ma(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Na(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Pa(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Y.workingColorSpace}var Fa={clone:Aa,merge:ja},Ia=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,La=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ra=class extends Gn{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ia,this.fragmentShader=La,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Aa(e.uniforms),this.uniformsGroups=Na(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new X().setHex(r.value);break;case`v2`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new nt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new Ue().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new st().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},za=class extends Ra{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Ba=class extends Gn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new X(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new X(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new G(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _t,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Va=class extends Ba{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new G(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return z(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new X(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new X(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new X(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},Ha=class extends Gn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new X(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new X(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new G(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _t,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ua=class extends Gn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Wa=class extends Gn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ga(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Ka(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var qa=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ja=class extends qa{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:N,endingEnd:N}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case P:i=e,o=2*t-n;break;case ne:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case P:a=e,s=2*n-t;break;case ne:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Ya=class extends qa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Xa=class extends qa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Za=class extends qa{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=eo(n,t,g,y,r);i[p]=Qa(x,o,_,b,m)}return i}};function Qa(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function $a(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function eo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Qa(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=$a(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var to=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ga(t,this.TimeBufferType),this.values=Ga(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ga(e.times,Array),values:Ga(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Ka(e.settings)&&(n.settings={inTangents:Ga(e.settings.inTangents,Array),outTangents:Ga(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Xa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Ya(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ja(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Za(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case A:t=this.InterpolantFactoryMethodDiscrete;break;case j:t=this.InterpolantFactoryMethodLinear;break;case te:t=this.InterpolantFactoryMethodSmooth;break;case M:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return I(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return A;case this.InterpolantFactoryMethodLinear:return j;case this.InterpolantFactoryMethodSmooth:return te;case this.InterpolantFactoryMethodBezier:return M}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Ka(this.settings)&&(no(this.settings.inTangents,e),no(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(L(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(L(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){L(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){L(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ue(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){L(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===te,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Ka(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function no(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}to.prototype.ValueTypeName=``,to.prototype.TimeBufferType=Float32Array,to.prototype.ValueBufferType=Float32Array,to.prototype.DefaultInterpolation=j;var ro=class extends to{constructor(e,t,n){super(e,t,n)}};ro.prototype.ValueTypeName=`bool`,ro.prototype.ValueBufferType=Array,ro.prototype.DefaultInterpolation=A,ro.prototype.InterpolantFactoryMethodLinear=void 0,ro.prototype.InterpolantFactoryMethodSmooth=void 0;var io=class extends to{constructor(e,t,n,r){super(e,t,n,r)}};io.prototype.ValueTypeName=`color`;var ao=class extends to{constructor(e,t,n,r){super(e,t,n,r)}};ao.prototype.ValueTypeName=`number`;var oo=class extends qa{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Be.slerpFlat(i,0,a,c-o,a,c,s);return i}},so=class extends to{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new oo(this.times,this.values,this.getValueSize(),e)}};so.prototype.ValueTypeName=`quaternion`,so.prototype.InterpolantFactoryMethodSmooth=void 0;var co=class extends to{constructor(e,t,n){super(e,t,n)}};co.prototype.ValueTypeName=`string`,co.prototype.ValueBufferType=Array,co.prototype.DefaultInterpolation=A,co.prototype.InterpolantFactoryMethodLinear=void 0,co.prototype.InterpolantFactoryMethodSmooth=void 0;var lo=class extends to{constructor(e,t,n,r){super(e,t,n,r)}};lo.prototype.ValueTypeName=`vector`;var uo=class extends Pt{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new X(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},fo=class extends uo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new X(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},po=new st,mo=new K,ho=new K,go=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new G(512,512),this.mapType=h,this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tr,this._frameExtents=new G(1,1),this._viewportCount=1,this._viewports=[new nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;mo.setFromMatrixPosition(e.matrixWorld),t.position.copy(mo),ho.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ho),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){po.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(po,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(po)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},_o=new K,vo=new Be,yo=new K,bo=class extends Pt{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=ce,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(_o,vo,yo),yo.x===1&&yo.y===1&&yo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_o,vo,yo.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(_o,vo,yo),yo.x===1&&yo.y===1&&yo.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(_o,vo,yo.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},xo=new K,So=new G,Co=new G,wo=class extends bo{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Se*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(xe*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Se*2*Math.atan(Math.tan(xe*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){xo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(xo.x,xo.y).multiplyScalar(-e/xo.z),xo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(xo.x,xo.y).multiplyScalar(-e/xo.z)}getViewSize(e,t){return this.getViewBounds(e,So,Co),t.subVectors(Co,So)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(xe*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},To=class extends go{constructor(){super(new wo(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Se*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Eo=class extends uo{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new To}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Do=class extends go{constructor(){super(new wo(90,1,.5,500)),this.isPointLightShadow=!0}},Oo=class extends uo{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new Do}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ko=class extends bo{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Ao=class extends go{constructor(){super(new ko(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},jo=class extends uo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(Pt.DEFAULT_UP),this.updateMatrix(),this.target=new Pt,this.shadow=new Ao}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Mo=-90,No=1,Po=class extends Pt{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new wo(Mo,No,e,t);r.layers=this.layers,this.add(r);let i=new wo(Mo,No,e,t);i.layers=this.layers,this.add(i);let a=new wo(Mo,No,e,t);a.layers=this.layers,this.add(a);let o=new wo(Mo,No,e,t);o.layers=this.layers,this.add(o);let s=new wo(Mo,No,e,t);s.layers=this.layers,this.add(s);let c=new wo(Mo,No,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Fo=class extends wo{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Io=`\\[\\]\\.:\\/`,Lo=RegExp(`[\\[\\]\\.:\\/]`,`g`),Ro=`[^\\[\\]\\.:\\/]`,zo=`[^`+Io.replace(`\\.`,``)+`]`,Bo=`((?:WC+[\\/:])*)`.replace(`WC`,Ro),Vo=`(WCOD+)?`.replace(`WCOD`,zo),Ho=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Ro),Uo=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Ro),Wo=RegExp(`^`+Bo+Vo+Ho+Uo+`$`),Go=[`material`,`materials`,`bones`,`map`],Ko=class{constructor(e,t,n){let r=n||qo.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},qo=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Lo,``)}static parseTrackName(e){let t=Wo.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Go.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){I(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){L(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){L(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){L(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){L(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){L(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){L(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){L(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;L(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){L(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){L(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};qo.Composite=Ko,qo.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},qo.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},qo.prototype.GetterByBindingType=[qo.prototype._getValue_direct,qo.prototype._getValue_array,qo.prototype._getValue_arrayElement,qo.prototype._getValue_toArray],qo.prototype.SetterByBindingTypeAndVersioning=[[qo.prototype._setValue_direct,qo.prototype._setValue_direct_setNeedsUpdate,qo.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[qo.prototype._setValue_array,qo.prototype._setValue_array_setNeedsUpdate,qo.prototype._setValue_array_setMatrixWorldNeedsUpdate],[qo.prototype._setValue_arrayElement,qo.prototype._setValue_arrayElement_setNeedsUpdate,qo.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[qo.prototype._setValue_fromArray,qo.prototype._setValue_fromArray_setNeedsUpdate,qo.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],a=class{constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}},a.prototype.isMatrix2=!0;function Jo(e,t,n,r){let i=Yo(r);switch(n){case 1021:return e*t;case E:return e*t/i.components*i.byteLength;case D:return e*t/i.components*i.byteLength;case O:return e*t*2/i.components*i.byteLength;case ee:return e*t*2/i.components*i.byteLength;case 1022:return e*t*3/i.components*i.byteLength;case C:return e*t*4/i.components*i.byteLength;case k:return e*t*4/i.components*i.byteLength;case 33776:case 33777:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 33778:case 33779:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 35841:case 35843:return Math.max(e,16)*Math.max(t,8)/4;case 35840:case 35842:return Math.max(e,8)*Math.max(t,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37808:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37809:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case 37810:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case 37811:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case 37812:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case 37813:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case 37814:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case 37815:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case 37816:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case 37817:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case 37818:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case 37819:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case 37820:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case 37821:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(e/4)*Math.ceil(t/4)*16;case 36283:case 36284:return Math.ceil(e/4)*Math.ceil(t/4)*8;case 36285:case 36286:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Yo(e){switch(e){case h:case 1010:return{byteLength:1,components:1};case g:case 1011:case y:return{byteLength:2,components:1};case b:case x:return{byteLength:2,components:4};case _:case 1013:case v:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?I(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Xo(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Zo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Qo={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Z={common:{diffuse:{value:new X(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new G(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new X(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new K},probesMax:{value:new K},probesResolution:{value:new K}},points:{diffuse:{value:new X(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new X(16777215)},opacity:{value:1},center:{value:new G(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},$o={basic:{uniforms:ja([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.fog]),vertexShader:Qo.meshbasic_vert,fragmentShader:Qo.meshbasic_frag},lambert:{uniforms:ja([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new X(0)},envMapIntensity:{value:1}}]),vertexShader:Qo.meshlambert_vert,fragmentShader:Qo.meshlambert_frag},phong:{uniforms:ja([Z.common,Z.specularmap,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,Z.lights,{emissive:{value:new X(0)},specular:{value:new X(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Qo.meshphong_vert,fragmentShader:Qo.meshphong_frag},standard:{uniforms:ja([Z.common,Z.envmap,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.roughnessmap,Z.metalnessmap,Z.fog,Z.lights,{emissive:{value:new X(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qo.meshphysical_vert,fragmentShader:Qo.meshphysical_frag},toon:{uniforms:ja([Z.common,Z.aomap,Z.lightmap,Z.emissivemap,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.gradientmap,Z.fog,Z.lights,{emissive:{value:new X(0)}}]),vertexShader:Qo.meshtoon_vert,fragmentShader:Qo.meshtoon_frag},matcap:{uniforms:ja([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,Z.fog,{matcap:{value:null}}]),vertexShader:Qo.meshmatcap_vert,fragmentShader:Qo.meshmatcap_frag},points:{uniforms:ja([Z.points,Z.fog]),vertexShader:Qo.points_vert,fragmentShader:Qo.points_frag},dashed:{uniforms:ja([Z.common,Z.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qo.linedashed_vert,fragmentShader:Qo.linedashed_frag},depth:{uniforms:ja([Z.common,Z.displacementmap]),vertexShader:Qo.depth_vert,fragmentShader:Qo.depth_frag},normal:{uniforms:ja([Z.common,Z.bumpmap,Z.normalmap,Z.displacementmap,{opacity:{value:1}}]),vertexShader:Qo.meshnormal_vert,fragmentShader:Qo.meshnormal_frag},sprite:{uniforms:ja([Z.sprite,Z.fog]),vertexShader:Qo.sprite_vert,fragmentShader:Qo.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qo.background_vert,fragmentShader:Qo.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Qo.backgroundCube_vert,fragmentShader:Qo.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qo.cube_vert,fragmentShader:Qo.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qo.equirect_vert,fragmentShader:Qo.equirect_frag},distance:{uniforms:ja([Z.common,Z.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qo.distance_vert,fragmentShader:Qo.distance_frag},shadow:{uniforms:ja([Z.lights,Z.fog,{color:{value:new X(0)},opacity:{value:1}}]),vertexShader:Qo.shadow_vert,fragmentShader:Qo.shadow_frag}};$o.physical={uniforms:ja([$o.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new G(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new X(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new G},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new X(0)},specularColor:{value:new X(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new G},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Qo.meshphysical_vert,fragmentShader:Qo.meshphysical_frag};var es={r:0,b:0,g:0},ts=new st,ns=new Ue;ns.set(-1,0,0,0,1,0,0,0,1);function rs(e,t,n,r,i,a){let o=new X(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new lr(new Zr(1,1,1),new Ra({name:`BackgroundCubeMaterial`,uniforms:Aa($o.backgroundCube.uniforms),vertexShader:$o.backgroundCube.vertexShader,fragmentShader:$o.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ts.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(ns),l.material.toneMapped=Y.getTransfer(i.colorSpace)!==F,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new lr(new Sa(2,2),new Ra({name:`BackgroundMaterial`,uniforms:Aa($o.background.uniforms),vertexShader:$o.background.vertexShader,fragmentShader:$o.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Y.getTransfer(i.colorSpace)!==F,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(es,Pa(e)),n.buffers.color.setClear(es.r,es.g,es.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function is(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function as(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function os(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(I(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&I(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function ss(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Un,s=new Ue,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var cs=4,ls=6,us=20,ds=256,fs=new ko,ps=new X,ms=null,hs=0,gs=0,_s=!1,vs=new K,ys=new K,bs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=vs}=i;ms=this._renderer.getRenderTarget(),hs=this._renderer.getActiveCubeFace(),gs=this._renderer.getActiveMipmapLevel(),_s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ds(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Es(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(ms,hs,gs),this._renderer.xr.enabled=_s,e.scissorTest=!1,Cs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ms=this._renderer.getRenderTarget(),hs=this._renderer.getActiveCubeFace(),gs=this._renderer.getActiveMipmapLevel(),_s=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:p,minFilter:p,generateMipmaps:!1,type:y,format:C,colorSpace:ie,depthBuffer:!1},r=Ss(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ss(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=xs(r)),this._blurMaterial=Ts(r,e,t),this._ggxMaterial=ws(r,e,t)}return r}_compileMaterial(e){let t=new lr(new zn,e);this._renderer.compile(t,fs)}_sceneToCubeUV(e,t,n,r,i){let a=new wo(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(ps),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new lr(new Zr,new Zn({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(ps),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Cs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ds()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Es());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Cs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,fs)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-cs?n-d+cs:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Cs(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,fs),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Cs(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,fs)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Cs(t,3*l*(r>this._lodMax-cs?r-this._lodMax+cs:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,fs)}};function xs(e){let t=[],n=[],r=e,i=e-cs+1+ls;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?ys.set(1,r,n):e===1?ys.set(-n,1,-r):e===2?ys.set(-n,r,1):e===3?ys.set(-1,r,-n):e===4?ys.set(-n,-1,r):ys.set(n,r,-1),ys.toArray(l,(e*6+t)*3)}}let u=new zn;u.setAttribute(`position`,new wn(c,3)),u.setAttribute(`outputDirection`,new wn(l,3)),n.push(new lr(u,null)),r>cs&&r--}return{lodMeshes:n,sizeLods:t}}function Ss(e,t,n){let r=new it(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Cs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function ws(e,t,n){return new Ra({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:ds,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Os(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ts(e,t,n){return new Ra({name:`SphericalGaussianBlur`,defines:{SAMPLES:us,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Os(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Es(){return new Ra({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Os(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ds(){return new Ra({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Os(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Os(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ks=class extends it{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Kr(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Zr(5,5,5),i=new Ra({name:`CubemapFromEquirect`,uniforms:Aa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new lr(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=p),new Po(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function As(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new ks(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new bs(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new bs(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function js(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&R(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ms(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?En:Tn)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Ns(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Ps(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:L(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Fs(e,t,n){let r=new WeakMap,i=new nt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new at(h,p,m,u);g.type=v,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new G(p,m)},r.set(o,d);function y(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Is(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Ls={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Rs(e,t,n,r,i,a){let o=new it(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new zn;l.setAttribute(`position`,new Dn([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Dn([0,2,0,0,2,0],2));let u=new za({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new lr(l,u),f=new ko(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,b=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new it(t,n,{type:y,depthBuffer:!1,stencilBuffer:!1}),c=new it(t,n,{type:y,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Y.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Ls[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var zs=new tt,Bs=new Jr(1,1),Vs=new at,Hs=new ot,Us=new Kr,Ws=[],Gs=[],Ks=new Float32Array(16),qs=new Float32Array(9),Js=new Float32Array(4);function Ys(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ws[i];if(a===void 0&&(a=new Float32Array(i),Ws[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Xs(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Zs(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Qs(e,t){let n=Gs[t];n===void 0&&(n=new Int32Array(t),Gs[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function $s(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function ec(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Xs(n,t))return;e.uniform2fv(this.addr,t),Zs(n,t)}}function tc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Xs(n,t))return;e.uniform3fv(this.addr,t),Zs(n,t)}}function nc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Xs(n,t))return;e.uniform4fv(this.addr,t),Zs(n,t)}}function rc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Xs(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Zs(n,t)}else{if(Xs(n,r))return;Js.set(r),e.uniformMatrix2fv(this.addr,!1,Js),Zs(n,r)}}function ic(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Xs(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Zs(n,t)}else{if(Xs(n,r))return;qs.set(r),e.uniformMatrix3fv(this.addr,!1,qs),Zs(n,r)}}function ac(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Xs(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Zs(n,t)}else{if(Xs(n,r))return;Ks.set(r),e.uniformMatrix4fv(this.addr,!1,Ks),Zs(n,r)}}function oc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function sc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Xs(n,t))return;e.uniform2iv(this.addr,t),Zs(n,t)}}function cc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Xs(n,t))return;e.uniform3iv(this.addr,t),Zs(n,t)}}function lc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Xs(n,t))return;e.uniform4iv(this.addr,t),Zs(n,t)}}function uc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function dc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Xs(n,t))return;e.uniform2uiv(this.addr,t),Zs(n,t)}}function fc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Xs(n,t))return;e.uniform3uiv(this.addr,t),Zs(n,t)}}function pc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Xs(n,t))return;e.uniform4uiv(this.addr,t),Zs(n,t)}}function mc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Bs.compareFunction=n.isReversedDepthBuffer()?518:515,a=Bs):a=zs,n.setTexture2D(t||a,i)}function hc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Hs,i)}function gc(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Us,i)}function _c(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Vs,i)}function vc(e){switch(e){case 5126:return $s;case 35664:return ec;case 35665:return tc;case 35666:return nc;case 35674:return rc;case 35675:return ic;case 35676:return ac;case 5124:case 35670:return oc;case 35667:case 35671:return sc;case 35668:case 35672:return cc;case 35669:case 35673:return lc;case 5125:return uc;case 36294:return dc;case 36295:return fc;case 36296:return pc;case 35678:case 36198:case 36298:case 36306:case 35682:return mc;case 35679:case 36299:case 36307:return hc;case 35680:case 36300:case 36308:case 36293:return gc;case 36289:case 36303:case 36311:case 36292:return _c}}function yc(e,t){e.uniform1fv(this.addr,t)}function bc(e,t){let n=Ys(t,this.size,2);e.uniform2fv(this.addr,n)}function xc(e,t){let n=Ys(t,this.size,3);e.uniform3fv(this.addr,n)}function Sc(e,t){let n=Ys(t,this.size,4);e.uniform4fv(this.addr,n)}function Cc(e,t){let n=Ys(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function wc(e,t){let n=Ys(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Tc(e,t){let n=Ys(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Ec(e,t){e.uniform1iv(this.addr,t)}function Dc(e,t){e.uniform2iv(this.addr,t)}function Oc(e,t){e.uniform3iv(this.addr,t)}function kc(e,t){e.uniform4iv(this.addr,t)}function Ac(e,t){e.uniform1uiv(this.addr,t)}function jc(e,t){e.uniform2uiv(this.addr,t)}function Mc(e,t){e.uniform3uiv(this.addr,t)}function Nc(e,t){e.uniform4uiv(this.addr,t)}function Pc(e,t,n){let r=this.cache,i=t.length,a=Qs(n,i);Xs(r,a)||(e.uniform1iv(this.addr,a),Zs(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Bs:zs;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Fc(e,t,n){let r=this.cache,i=t.length,a=Qs(n,i);Xs(r,a)||(e.uniform1iv(this.addr,a),Zs(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Hs,a[e])}function Ic(e,t,n){let r=this.cache,i=t.length,a=Qs(n,i);Xs(r,a)||(e.uniform1iv(this.addr,a),Zs(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Us,a[e])}function Lc(e,t,n){let r=this.cache,i=t.length,a=Qs(n,i);Xs(r,a)||(e.uniform1iv(this.addr,a),Zs(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Vs,a[e])}function Rc(e){switch(e){case 5126:return yc;case 35664:return bc;case 35665:return xc;case 35666:return Sc;case 35674:return Cc;case 35675:return wc;case 35676:return Tc;case 5124:case 35670:return Ec;case 35667:case 35671:return Dc;case 35668:case 35672:return Oc;case 35669:case 35673:return kc;case 5125:return Ac;case 36294:return jc;case 36295:return Mc;case 36296:return Nc;case 35678:case 36198:case 36298:case 36306:case 35682:return Pc;case 35679:case 36299:case 36307:return Fc;case 35680:case 36300:case 36308:case 36293:return Ic;case 36289:case 36303:case 36311:case 36292:return Lc}}var zc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=vc(t.type)}},Bc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Rc(t.type)}},Vc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Hc=/(\w+)(\])?(\[|\.)?/g;function Uc(e,t){e.seq.push(t),e.map[t.id]=t}function Wc(e,t,n){let r=e.name,i=r.length;for(Hc.lastIndex=0;;){let a=Hc.exec(r),o=Hc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Uc(n,l===void 0?new zc(s,e,t):new Bc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Vc(s),Uc(n,e)),n=e}}}var Gc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Wc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Kc(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var qc=37297,Jc=0;function Yc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Xc=new Ue;function Zc(e){Y._getMatrix(Xc,Y.workingColorSpace,e);let t=`mat3( ${Xc.elements.map(e=>e.toFixed(4))} )`;switch(Y.getTransfer(e)){case ae:return[t,`LinearTransferOETF`];case F:return[t,`sRGBTransferOETF`];default:return I(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Qc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Yc(e.getShaderSource(t),r)}return i}function $c(e,t){let n=Zc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var el={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function tl(e,t){let n=el[t];return n===void 0?(I(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var nl=new K;function rl(){return Y.getLuminanceCoefficients(nl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${nl.x.toFixed(4)}, ${nl.y.toFixed(4)}, ${nl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function il(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(sl).join(`
`)}function al(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function ol(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function sl(e){return e!==``}function cl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ll(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ul=/^[ \t]*#include +<([\w\d./]+)>/gm;function dl(e){return e.replace(ul,pl)}var fl=new Map;function pl(e,t){let n=Qo[t];if(n===void 0){let e=fl.get(t);if(e!==void 0)n=Qo[e],I(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return dl(n)}var ml=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hl(e){return e.replace(ml,gl)}function gl(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function _l(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var vl={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function yl(e){return vl[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var bl={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function xl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:bl[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Sl={302:`ENVMAP_MODE_REFRACTION`};function Cl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Sl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var wl={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Tl(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:wl[e.combine]||`ENVMAP_BLENDING_NONE`}function El(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function Dl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=yl(n),l=xl(n),u=Cl(n),d=Tl(n),f=El(n),p=il(n),m=al(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(sl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(sl).join(`
`),_.length>0&&(_+=`
`)):(g=[_l(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(sl).join(`
`),_=[_l(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Qo.tonemapping_pars_fragment,n.toneMapping===0?``:tl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Qo.colorspace_pars_fragment,$c(`linearToOutputTexel`,n.outputColorSpace),rl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(sl).join(`
`)),o=dl(o),o=cl(o,n),o=ll(o,n),s=dl(s),s=cl(s,n),s=ll(s,n),o=hl(o),s=hl(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Kc(i,i.VERTEX_SHADER,y),S=Kc(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Qc(i,x,`vertex`),n=Qc(i,S,`fragment`);L(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):I(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Gc(i,h),T=ol(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,qc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Jc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Ol=0,kl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Al(e),t.set(e,n)),n}},Al=class{constructor(e){this.id=Ol++,this.code=e,this.usedTimes=0}};function jl(e){return e===1030||e===37490||e===36285}function Ml(e,t,n,r,i,a){let o=new vt,s=new kl,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&I(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,k;if(C){let e=$o[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),te=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,N=!!i.map,P=!!i.matcap,ne=!!x,re=!!i.aoMap,ie=!!i.lightMap,ae=!!i.bumpMap&&i.wireframe===!1,F=!!i.normalMap,oe=!!i.displacementMap,se=!!i.emissiveMap,ce=!!i.metalnessMap,le=!!i.roughnessMap,ue=i.anisotropy>0,de=i.clearcoat>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,L=i.transmission>0,R=ue&&!!i.anisotropyMap,ge=de&&!!i.clearcoatMap,_e=de&&!!i.clearcoatNormalMap,ve=de&&!!i.clearcoatRoughnessMap,ye=me&&!!i.iridescenceMap,be=me&&!!i.iridescenceThicknessMap,xe=he&&!!i.sheenColorMap,Se=he&&!!i.sheenRoughnessMap,Ce=!!i.specularMap,z=!!i.specularColorMap,we=!!i.specularIntensityMap,Te=L&&!!i.transmissionMap,Ee=L&&!!i.thicknessMap,B=!!i.gradientMap,De=!!i.alphaMap,Oe=i.alphaTest>0,ke=!!i.alphaHash,Ae=!!i.extensions,je=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(je=e.toneMapping);let Me={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:te,instancingColor:te&&h.instanceColor!==null,instancingMorph:te&&h.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Y.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:N,matcap:P,envMap:ne,envMapMode:ne&&x.mapping,envMapCubeUVHeight:S,aoMap:re,lightMap:ie,bumpMap:ae,normalMap:F,displacementMap:oe,emissiveMap:se,normalMapObjectSpace:F&&i.normalMapType===1,normalMapTangentSpace:F&&i.normalMapType===0,packedNormalMap:F&&i.normalMapType===0&&jl(i.normalMap.format),metalnessMap:ce,roughnessMap:le,anisotropy:ue,anisotropyMap:R,clearcoat:de,clearcoatMap:ge,clearcoatNormalMap:_e,clearcoatRoughnessMap:ve,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:ye,iridescenceThicknessMap:be,sheen:he,sheenColorMap:xe,sheenRoughnessMap:Se,specularMap:Ce,specularColorMap:z,specularIntensityMap:we,transmission:L,transmissionMap:Te,thicknessMap:Ee,gradientMap:B,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:De,alphaTest:Oe,alphaHash:ke,combine:i.combine,mapUv:N&&m(i.map.channel),aoMapUv:re&&m(i.aoMap.channel),lightMapUv:ie&&m(i.lightMap.channel),bumpMapUv:ae&&m(i.bumpMap.channel),normalMapUv:F&&m(i.normalMap.channel),displacementMapUv:oe&&m(i.displacementMap.channel),emissiveMapUv:se&&m(i.emissiveMap.channel),metalnessMapUv:ce&&m(i.metalnessMap.channel),roughnessMapUv:le&&m(i.roughnessMap.channel),anisotropyMapUv:R&&m(i.anisotropyMap.channel),clearcoatMapUv:ge&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:_e&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ve&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:be&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Se&&m(i.sheenRoughnessMap.channel),specularMapUv:Ce&&m(i.specularMap.channel),specularColorMapUv:z&&m(i.specularColorMap.channel),specularIntensityMapUv:we&&m(i.specularIntensityMap.channel),transmissionMapUv:Te&&m(i.transmissionMap.channel),thicknessMapUv:Ee&&m(i.thicknessMap.channel),alphaMapUv:De&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(F||ue),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(N||De),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&F===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:je,decodeVideoTexture:N&&i.map.isVideoTexture===!0&&Y.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:se&&i.emissiveMap.isVideoTexture===!0&&Y.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ae&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ae&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Me.vertexUv1s=c.has(1),Me.vertexUv2s=c.has(2),Me.vertexUv3s=c.has(3),c.clear(),Me}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=$o[t];n=Fa.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new Dl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Nl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Pl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Fl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Il(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Pl),r.length>1&&r.sort(t||Fl),i.length>1&&i.sort(t||Fl)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Ll(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Il,e.set(t,[i])):n>=r.length?(i=new Il,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Rl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new K,color:new X};break;case`SpotLight`:n={position:new K,direction:new K,color:new X,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new K,color:new X,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new K,skyColor:new X,groundColor:new X};break;case`RectAreaLight`:n={color:new X,position:new K,halfWidth:new K,halfHeight:new K}}return e[t.id]=n,n}}}function zl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Bl=0;function Vl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Hl(e){let t=new Rl,n=zl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new K);let i=new K,a=new st,o=new st;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Vl);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Z.LTC_FLOAT_1,r.rectAreaLTC2=Z.LTC_FLOAT_2):(r.rectAreaLTC1=Z.LTC_HALF_1,r.rectAreaLTC2=Z.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Bl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Ul(e){let t=new Hl(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Wl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Ul(e),t.set(n,[a])):r>=i.length?(a=new Ul(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Gl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kl=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ql=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],Jl=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],Yl=new st,Xl=new K,Zl=new K;function Ql(e,t,n){let r=new Tr,i=new G,a=new G,o=new nt,s=new Ua,c=new Wa,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},m=new Ra({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new G},radius:{value:4}},vertexShader:Gl,fragmentShader:Kl}),h=m.clone();h.defines.HORIZONTAL_PASS=1;let g=new zn;g.setAttribute(`position`,new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new lr(g,m),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,s){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(I(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.state;m.setBlending(0),m.buffers.depth.getReversed()===!0?m.buffers.color.setClear(0,0,0,0):m.buffers.color.setClear(1,1,1,1),m.buffers.depth.setTest(!0),m.setScissorTest(!1);let h=S!==this.type;h&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){I(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let g=d.getFrameExtents();i.multiply(g),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/g.x),i.x=a.x*g.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/g.y),i.y=a.y*g.y,d.mapSize.y=a.y));let b=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=b,d.map===null||h===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){I(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new it(i.x,i.y,{format:O,type:y,minFilter:p,magFilter:p,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Jr(i.x,i.y,v),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=w,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=f,d.map.depthTexture.magFilter=f}else l.isPointLight?(d.map=new ks(i.x),d.map.depthTexture=new Yr(i.x,_)):(d.map=new it(i.x,i.y),d.map.depthTexture=new Jr(i.x,i.y,_)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=w,this.type===1?(d.map.depthTexture.compareFunction=b?518:515,d.map.depthTexture.minFilter=p,d.map.depthTexture.magFilter=p):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=f,d.map.depthTexture.magFilter=f);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let x=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<x;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Xl.setFromMatrixPosition(l.matrixWorld),e.position.copy(Xl),Zl.copy(e.position),Zl.add(ql[t]),e.up.copy(Jl[t]),e.lookAt(Zl),e.updateMatrixWorld(),n.makeTranslation(-Xl.x,-Xl.y,-Xl.z),Yl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Yl,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),m.viewport(o)}r=d.getFrustum(t),E(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&C(d,s),d.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(c,l,d)};function C(n,r){let a=t.update(b);m.defines.VSM_SAMPLES!==n.blurSamples&&(m.defines.VSM_SAMPLES=n.blurSamples,h.defines.VSM_SAMPLES=n.blurSamples,m.needsUpdate=!0,h.needsUpdate=!0),n.mapPass===null?n.mapPass=new it(i.x,i.y,{format:O,type:y}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),m.uniforms.shadow_pass.value=n.map.depthTexture,m.uniforms.resolution.value.set(n.map.width,n.map.height),m.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,m,b,null),h.uniforms.shadow_pass.value=n.mapPass.texture,h.uniforms.resolution.value.set(n.map.width,n.map.height),h.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,h,b,null)}function T(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=T(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=T(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],i,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function $l(e,t){function n(){let t=!1,n=new nt,r=null,i=new nt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?ce(e.DEPTH_TEST):le(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=_e[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?ce(e.STENCIL_TEST):le(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,A=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),te=!1,M=0,N=e.getParameter(e.VERSION);N.indexOf(`WebGL`)===-1?N.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),te=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(N)[1]),te=M>=1);let P=null,ne={},re=e.getParameter(e.SCISSOR_BOX),ie=e.getParameter(e.VIEWPORT),ae=new nt().fromArray(re),F=new nt().fromArray(ie);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let se={};se[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),se[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),se[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),ce(e.DEPTH_TEST),o.setFunc(3),R(!1),ge(1),ce(e.CULL_FACE),he(0);function ce(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function le(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ue(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function de(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function fe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let pe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};pe[103]=e.MIN,pe[104]=e.MAX;let me={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function he(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(le(e.BLEND),g=!1);else if(g===!1&&(ce(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:L(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:L(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:L(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:L(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a=a||n,o=o||r,s=s||i,(n!==v||a!==x)&&(e.blendEquationSeparate(pe[n],pe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(me[r],me[i],me[o],me[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function I(t,n){t.side===2?le(e.CULL_FACE):ce(e.CULL_FACE);let r=t.side===1;n&&(r=!r),R(r),t.blending===1&&t.transparent===!1?he(0):he(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?ce(e.SAMPLE_ALPHA_TO_COVERAGE):le(e.SAMPLE_ALPHA_TO_COVERAGE)}function R(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ge(t){t===0?le(e.CULL_FACE):(ce(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==ee&&(te&&e.lineWidth(t),ee=t)}function ye(t,n,r){t?(ce(e.POLYGON_OFFSET_FILL),(k!==n||A!==r)&&(k=n,A=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):le(e.POLYGON_OFFSET_FILL)}function be(t){t?ce(e.SCISSOR_TEST):le(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+j-1),P!==t&&(e.activeTexture(t),P=t)}function Se(t,n,r){r===void 0&&(r=P===null?e.TEXTURE0+j-1:P);let i=ne[r];i===void 0&&(i={type:void 0,texture:void 0},ne[r]=i),(i.type!==t||i.texture!==n)&&(P!==r&&(e.activeTexture(r),P=r),e.bindTexture(t,n||se[t]),i.type=t,i.texture=n)}function Ce(){let t=ne[P];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function z(){try{e.compressedTexImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function we(){try{e.compressedTexImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Te(){try{e.texSubImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ee(){try{e.texSubImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function B(){try{e.compressedTexSubImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function De(){try{e.compressedTexSubImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){L(`WebGLState:`,e)}}function je(){try{e.texImage3D(...arguments)}catch(e){L(`WebGLState:`,e)}}function Me(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ne(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Pe(t){ae.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ae.copy(t))}function V(t){F.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),F.copy(t))}function Fe(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ie(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Le(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},P=null,ne={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new X(0,0,0),T=0,E=!1,D=null,O=null,ee=null,k=null,A=null,ae.set(0,0,e.canvas.width,e.canvas.height),F.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:ce,disable:le,bindFramebuffer:ue,drawBuffers:de,useProgram:fe,setBlending:he,setMaterial:I,setFlipSided:R,setCullFace:ge,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:Se,unbindTexture:Ce,compressedTexImage2D:z,compressedTexImage3D:we,texImage2D:Ae,texImage3D:je,pixelStorei:Ne,getParameter:Me,updateUBOMapping:Fe,uniformBlockBinding:Ie,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:Te,texSubImage3D:Ee,compressedTexSubImage2D:B,compressedTexSubImage3D:De,scissor:Pe,viewport:V,reset:Le}}function eu(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),h=new G,g=new WeakMap,_=new Set,v,y=new WeakMap,b=!1;try{b=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function x(e,t){return b?new OffscreenCanvas(e,t):de(`canvas`)}function S(e,t,n){let r=1,i=je(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);v===void 0&&(v=x(n,a));let o=t?x(n,a):v;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),I(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&I(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function C(e){return e.generateMipmaps}function w(t){e.generateMipmap(t)}function E(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function D(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];I(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||I(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?ae:Y.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function O(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,I(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function ee(e,t){return C(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function k(e){let t=e.target;t.removeEventListener(`dispose`,k),j(t),t.isVideoTexture&&g.delete(t),t.isHTMLTexture&&_.delete(t)}function A(e){let t=e.target;t.removeEventListener(`dispose`,A),M(t)}function j(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=y.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&te(e),Object.keys(i).length===0&&y.delete(n)}r.remove(e)}function te(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=y.get(i);delete a[n.__cacheKey],o.memory.textures--}function M(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let N=0;function P(){N=0}function ne(){return N}function re(e){N=e}function ie(){let e=N;return e>=i.maxTextures&&I(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),N+=1,e}function F(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function oe(t,i){let a=r.get(t);if(t.isVideoTexture&&ke(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)I(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)I(`WebGLRenderer: Texture marked for update but image is incomplete`);else{_e(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?_e(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function ce(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?_e(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function le(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?ve(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ue={[l]:e.REPEAT,[u]:e.CLAMP_TO_EDGE,[d]:e.MIRRORED_REPEAT},fe={[f]:e.NEAREST,1004:e.NEAREST_MIPMAP_NEAREST,1005:e.NEAREST_MIPMAP_LINEAR,[p]:e.LINEAR,1007:e.LINEAR_MIPMAP_NEAREST,[m]:e.LINEAR_MIPMAP_LINEAR},pe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function me(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&I(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ue[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ue[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ue[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,fe[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,fe[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,pe[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function he(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,k));let i=n.source,a=y.get(i);a===void 0&&(a={},y.set(i,a));let s=F(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&te(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function R(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ge(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=R(n.start,r.width,4),c=R(t.start,r.width,4);n.start<=i+1&&a===c&&R(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function _e(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=he(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let d=r.get(u);if(u.version!==d.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=S(o.image,!1,i.maxTextureSize);t=Ae(o,t);let r=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=D(o.internalFormat,r,f,o.normalized,o.colorSpace,o.isVideoTexture);me(c,o);let m,h=o.mipmaps,g=o.isVideoTexture!==!0,v=d.__version===void 0||l===!0,y=u.dataReady,b=ee(o,t);if(o.isDepthTexture)p=O(o.format===T,o.type),v&&(g?n.texStorage2D(e.TEXTURE_2D,1,p,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,null));else if(o.isDataTexture){if(h.length>0){g&&v&&n.texStorage2D(e.TEXTURE_2D,b,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],g?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data);o.generateMipmaps=!1}else g?(v&&n.texStorage2D(e.TEXTURE_2D,b,p,t.width,t.height),y&&ge(o,t,r,f)):n.texImage2D(e.TEXTURE_2D,0,p,t.width,t.height,0,r,f,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){g&&v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,b,p,h[0].width,h[0].height,t.depth);for(let i=0,a=h.length;i<a;i++)if(m=h[i],o.format!==1023){if(r!==null){if(g){if(y){if(o.layerUpdates.size>0){let t=Jo(m.width,m.height,o.format,o.type);for(let a of o.layerUpdates){let o=m.data.subarray(a*t/m.data.BYTES_PER_ELEMENT,(a+1)*t/m.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,m.width,m.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,m.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,m.data,0,0)}else I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?y&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,m.width,m.height,t.depth,r,f,m.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,p,m.width,m.height,t.depth,0,r,f,m.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{g&&v&&n.texStorage2D(e.TEXTURE_2D,b,p,h[0].width,h[0].height);for(let t=0,i=h.length;t<i;t++)m=h[t],o.format===1023?g?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,f,m.data):n.texImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,r,f,m.data):r===null?I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?y&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,m.width,m.height,r,m.data):n.compressedTexImage2D(e.TEXTURE_2D,t,p,m.width,m.height,0,m.data)}}else if(o.isDataArrayTexture){if(g){if(v&&n.texStorage3D(e.TEXTURE_2D_ARRAY,b,p,t.width,t.height,t.depth),y){if(o.layerUpdates.size>0){let i=Jo(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,f,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,p,t.width,t.height,t.depth,0,r,f,t.data)}else if(o.isData3DTexture)g?(v&&n.texStorage3D(e.TEXTURE_3D,b,p,t.width,t.height,t.depth),y&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,f,t.data)):n.texImage3D(e.TEXTURE_3D,0,p,t.width,t.height,t.depth,0,r,f,t.data);else if(o.isFramebufferTexture){if(v){if(g)n.texStorage2D(e.TEXTURE_2D,b,p,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<b;t++)n.texImage2D(e.TEXTURE_2D,t,p,i,a,0,r,f,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),_.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of _)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&v){let t=je(h[0]);n.texStorage2D(e.TEXTURE_2D,b,p,t.width,t.height)}for(let t=0,i=h.length;t<i;t++)m=h[t],g?y&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,f,m):n.texImage2D(e.TEXTURE_2D,t,p,r,f,m);o.generateMipmaps=!1}else if(g){if(v){let r=je(t);n.texStorage2D(e.TEXTURE_2D,b,p,r.width,r.height)}y&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,f,t)}else n.texImage2D(e.TEXTURE_2D,0,p,r,f,t);C(o)&&w(c),d.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ve(t,o,s){if(o.image.length!==6)return;let c=he(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Y.getPrimaries(Y.workingColorSpace),r=o.colorSpace===``?null:Y.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=S(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Ae(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),v=D(o.internalFormat,g,_,o.normalized,o.colorSpace),y=o.isVideoTexture!==!0,b=u.__version===void 0||c===!0,x=l.dataReady,T=ee(o,h);me(e.TEXTURE_CUBE_MAP,o);let E;if(f){y&&b&&n.texStorage2D(e.TEXTURE_CUBE_MAP,T,v,h.width,h.height);for(let t=0;t<6;t++){E=m[t].mipmaps;for(let r=0;r<E.length;r++){let i=E[r];o.format===1023?y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,g,_,i.data):g===null?I(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,v,i.width,i.height,0,i.data)}}}else{if(E=o.mipmaps,y&&b){E.length>0&&T++;let t=je(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,T,v,t.width,t.height)}for(let t=0;t<6;t++)if(p){y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<E.length;r++){let i=E[r].image[t].image;y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,i.width,i.height,0,g,_,i.data)}}else{y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,v,g,_,m[t]);for(let r=0;r<E.length;r++){let i=E[r];y?x&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,v,g,_,i.image[t])}}}C(o)&&w(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ye(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=D(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,De(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function be(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=O(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Oe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=D(o.internalFormat,c,l,o.normalized,o.colorSpace);Oe(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,De(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,De(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function xe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,k)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),me(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else oe(i.depthTexture,0);let u=l.__webglTexture,d=De(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Oe(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Se(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)xe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?xe(i.__webglFramebuffer[0],t,0):xe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),be(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),be(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,i){let a=r.get(t);n!==void 0&&ye(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Se(t)}function z(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,A);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Oe(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=D(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=De(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),be(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),me(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ye(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ye(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);C(i)&&w(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),me(c,a),ye(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),C(a)&&w(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),me(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ye(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ye(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);C(i)&&w(r),n.unbindTexture()}t.depthBuffer&&Se(t)}function we(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(C(a)){let t=E(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),w(t),n.unbindTexture()}}}let Te=[],Ee=[];function B(t){if(t.samples>0){if(Oe(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Te.length=0,Ee.length=0,Te.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Te.push(l),Ee.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ee)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Te))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function De(e){return Math.min(i.maxSamples,e.samples)}function Oe(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function ke(e){let t=o.render.frame;g.get(e)!==t&&(g.set(e,t),e.update())}function Ae(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Y.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&I(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):L(`WebGLTextures: Unsupported texture color space:`,n)),t}function je(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(h.width=e.naturalWidth||e.width,h.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(h.width=e.displayWidth,h.height=e.displayHeight):(h.width=e.width,h.height=e.height),h}this.allocateTextureUnit=ie,this.resetTextureUnits=P,this.getTextureUnits=ne,this.setTextureUnits=re,this.setTexture2D=oe,this.setTexture2DArray=se,this.setTexture3D=ce,this.setTextureCube=le,this.rebindTextures=Ce,this.setupRenderTarget=z,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=B,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=Oe,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function tu(e,t){function n(n,r=``){let i,a=Y.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var nu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ru=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,iu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Xr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Ra({vertexShader:nu,fragmentShader:ru,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new lr(new Sa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},au=class extends ve{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,g=new iu,v={},y=t.getContextAttributes(),b=null,x=null,E=[],D=[],O=new G,ee=null,k=null,A=new wo;A.viewport=new nt;let j=new wo;j.viewport=new nt;let te=[A,j],M=new Fo,N=null,P=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=E[e];return t===void 0&&(t=new Lt,E[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=E[e];return t===void 0&&(t=new Lt,E[e]=t),t.getGripSpace()},this.getHand=function(e){let t=E[e];return t===void 0&&(t=new Lt,E[e]=t),t.getHandSpace()};function ne(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=E[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,ne),r.removeEventListener(`selectstart`,ne),r.removeEventListener(`selectend`,ne),r.removeEventListener(`squeeze`,ne),r.removeEventListener(`squeezestart`,ne),r.removeEventListener(`squeezeend`,ne),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ie);for(let e=0;e<E.length;e++){let t=D[e];t!==null&&(D[e]=null,E[e].disconnect(t))}N=null,P=null,g.reset();for(let e in v)delete v[e];if(e.setRenderTarget(b),f=null,d=null,u=null,r=null,x=null,de.stop(),n.isPresenting=!1,e.setPixelRatio(ee),e.setSize(O.width,O.height,!1),k!==null){let e=k.camera;e.fov=k.fov,e.zoom=k.zoom,e.updateProjectionMatrix(),k=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&I(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&I(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(b=e.getRenderTarget(),r.addEventListener(`select`,ne),r.addEventListener(`selectstart`,ne),r.addEventListener(`selectend`,ne),r.addEventListener(`squeeze`,ne),r.addEventListener(`squeezestart`,ne),r.addEventListener(`squeezeend`,ne),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ie),y.xrCompatible!==!0&&await t.makeXRCompatible(),ee=e.getPixelRatio(),e.getSize(O),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;y.depth&&(o=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=y.stencil?T:w,a=y.stencil?S:_);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new it(d.textureWidth,d.textureHeight,{format:C,type:h,depthTexture:new Jr(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new it(f.framebufferWidth,f.framebufferHeight,{format:C,type:h,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),de.setContext(r),de.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ie(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,E[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<E.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=E[r];i&&i.connect(n)}}let ae=new K,F=new K;function oe(e,t,n){ae.setFromMatrixPosition(t.matrixWorld),F.setFromMatrixPosition(n.matrixWorld);let r=ae.distanceTo(F),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function se(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;g.texture!==null&&(g.depthNear>0&&(t=g.depthNear),g.depthFar>0&&(n=g.depthFar)),M.near=j.near=A.near=t,M.far=j.far=A.far=n,(N!==M.near||P!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),N=M.near,P=M.far),M.layers.mask=e.layers.mask|6,A.layers.mask=M.layers.mask&-5,j.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;se(M,i);for(let e=0;e<a.length;e++)se(a[e],i);a.length===2?oe(M,A,j):M.projectionMatrix.copy(A.projectionMatrix),k===null&&e.isPerspectiveCamera&&(k={camera:e,fov:e.fov,zoom:e.zoom}),ce(e,M,i)};function ce(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Se*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(M)},this.getCameraTexture=function(e){return v[e]};let le=null;function ue(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(x,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(x))}let o=te[n];o===void 0&&(o=new wo,o.layers.enable(n),o.viewport=new nt,te[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&g.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new Xr,v[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<E.length;e++){let t=D[e],n=E[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}le&&le(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let de=new Xo;de.setAnimationLoop(ue),this.setAnimationLoop=function(e){le=e},this.dispose=function(){}}},ou=new st,su=new Ue;su.set(-1,0,0,0,1,0,0,0,1);function cu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Pa(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(ou.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(su),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function lu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return L(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?I(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):I(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var uu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),du=null;function fu(){return du===null&&(du=new fr(uu,16,16,O,y),du.name=`DFG_LUT`,du.minFilter=p,du.magFilter=p,du.wrapS=u,du.wrapT=u,du.generateMipmaps=!1,du.needsUpdate=!0),du}var pu=class{constructor(e={}){let{canvas:t=fe(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=h}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let v=f,C=new Set([k,ee,D]),w=new Set([h,_,g,S,b,x]),T=new Uint32Array(4),E=new Int32Array(4),O=new K,A=null,j=null,te=[],M=[],N=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,ne=!1,ie=null,ae=null,F=null,oe=null;this._outputColorSpace=re;let se=0,le=0,ue=null,de=-1,pe=null,he=new nt,R=new nt,_e=null,ve=new X(0),ye=0,be=t.width,xe=t.height,Se=1,Ce=null,z=null,we=new nt(0,0,be,xe),Te=new nt(0,0,be,xe),Ee=!1,B=new Tr,De=!1,Oe=!1,ke=new st,Ae=new K,je=new nt,Me={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ne=!1;function Pe(){return ue===null?Se:1}let V=n;function Fe(e,n){return t.getContext(e,n)}let Ie,Le,H,Re,U,W,ze,G,Be,Ve,He,Ue,We,q,Ge,J,Ke,qe,Je,Ye,Xe,Ze,Qe;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,tt,!1),t.addEventListener(`webglcontextrestored`,rt,!1),t.addEventListener(`webglcontextcreationerror`,at,!1),V===null){let t=`webgl2`;if(V=Fe(t,e),V===null)throw Fe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}$e()}catch(e){throw t.removeEventListener(`webglcontextlost`,tt,!1),t.removeEventListener(`webglcontextrestored`,rt,!1),t.removeEventListener(`webglcontextcreationerror`,at,!1),L(`WebGLRenderer: `+e.message),e}function $e(){Ie=new js(V),Ie.init(),Xe=new tu(V,Ie),Le=new os(V,Ie,e,Xe),H=new $l(V,Ie),Le.reversedDepthBuffer&&d&&H.buffers.depth.setReversed(!0),ae=V.createFramebuffer(),F=V.createFramebuffer(),oe=V.createFramebuffer(),Re=new Ps(V),U=new Nl,W=new eu(V,Ie,H,U,Le,Xe,Re),ze=new As(P),G=new Zo(V),Ze=new is(V,G),Be=new Ms(V,G,Re,Ze),Ve=new Is(V,Be,G,Ze,Re),qe=new Fs(V,Le,W),Ge=new ss(U),He=new Ml(P,ze,Ie,Le,Ze,Ge),Ue=new cu(P,U),We=new Ll,q=new Wl(Ie),Ke=new rs(P,ze,H,Ve,p,s),J=new Ql(P,Ve,Le),Qe=new lu(V,Re,Le,H),Je=new as(V,Ie,Re),Ye=new Ns(V,Ie,Re),Re.programs=He.programs,P.capabilities=Le,P.extensions=Ie,P.properties=U,P.renderLists=We,P.shadowMap=J,P.state=H,P.info=Re}v!==1009&&(N=new Rs(v,t.width,t.height,o,r,i));let et=new au(P,V);this.xr=et,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){let e=Ie.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ie.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return Se},this.setPixelRatio=function(e){e!==void 0&&(Se=e,this.setSize(be,xe,!1))},this.getSize=function(e){return e.set(be,xe)},this.setSize=function(e,n,r=!0){et.isPresenting?I(`WebGLRenderer: Can't change size while VR device is presenting.`):(be=e,xe=n,t.width=Math.floor(e*Se),t.height=Math.floor(n*Se),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),N!==null&&N.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(be*Se,xe*Se).floor()},this.setDrawingBufferSize=function(e,n,r){be=e,xe=n,Se=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(v===1009)L(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){I(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}N.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(he)},this.getViewport=function(e){return e.copy(we)},this.setViewport=function(e,t,n,r){e.isVector4?we.set(e.x,e.y,e.z,e.w):we.set(e,t,n,r),H.viewport(he.copy(we).multiplyScalar(Se).round())},this.getScissor=function(e){return e.copy(Te)},this.setScissor=function(e,t,n,r){e.isVector4?Te.set(e.x,e.y,e.z,e.w):Te.set(e,t,n,r),H.scissor(R.copy(Te).multiplyScalar(Se).round())},this.getScissorTest=function(){return Ee},this.setScissorTest=function(e){H.setScissorTest(Ee=e)},this.setOpaqueSort=function(e){Ce=e},this.setTransparentSort=function(e){z=e},this.getClearColor=function(e){return e.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(ue!==null){let t=ue.texture.format;e=C.has(t)}if(e){let e=ue.texture.type,t=w.has(e),n=Ke.getClearColor(),r=Ke.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,V.clearBufferuiv(V.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,V.clearBufferiv(V.COLOR,0,E))}else r|=V.COLOR_BUFFER_BIT}t&&(r|=V.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&V.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ie=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,tt,!1),t.removeEventListener(`webglcontextrestored`,rt,!1),t.removeEventListener(`webglcontextcreationerror`,at,!1),Ke.dispose(),We.dispose(),q.dispose(),U.dispose(),ze.dispose(),Ve.dispose(),Ze.dispose(),Qe.dispose(),He.dispose(),et.dispose(),et.removeEventListener(`sessionstart`,pt),et.removeEventListener(`sessionend`,mt),ht.stop()};function tt(e){e.preventDefault(),me(`WebGLRenderer: Context Lost.`),ne=!0}function rt(){me(`WebGLRenderer: Context Restored.`),ne=!1;let e=Re.autoReset,t=J.enabled,n=J.autoUpdate,r=J.needsUpdate,i=J.type;$e(),Re.autoReset=e,J.enabled=t,J.autoUpdate=n,J.needsUpdate=r,J.type=i}function at(e){L(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function ot(e){let t=e.target;t.removeEventListener(`dispose`,ot),ct(t)}function ct(e){lt(e),U.remove(e)}function lt(e){let t=U.get(e).programs;t!==void 0&&(t.forEach(function(e){He.releaseProgram(e)}),e.isShaderMaterial&&He.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=Me);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Tt(e,t,n,r,i);H.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Be.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ze.setup(i,r,s,n,c);let h,g=Je;if(c!==null&&(h=G.get(c),g=Ye,g.setIndex(h)),i.isMesh)r.wireframe===!0?(H.setLineWidth(r.wireframeLinewidth*Pe()),g.setMode(V.LINES)):g.setMode(V.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),H.setLineWidth(e*Pe()),i.isLineSegments?g.setMode(V.LINES):i.isLineLoop?g.setMode(V.LINE_LOOP):g.setMode(V.LINE_STRIP)}else i.isPoints?g.setMode(V.POINTS):i.isSprite&&g.setMode(V.TRIANGLES);if(i.isBatchedMesh){if(Ie.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?G.get(c).bytesPerElement:1,o=U.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(V,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ut(e,t,n,r){ie!==null&&e.isNodeMaterial&&ie.setObject(r,e),De===!0&&Ge.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,xt(e,t,r),e.side=0,e.needsUpdate=!0,xt(e,t,r),e.side=2):xt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),ie!==null&&ie.renderStart(e,t,n),j=q.get(n),j.init(t),M.push(j),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),j.setupLights(),ie!==null&&ie.updateLights(j.state.lightsArray),Oe=this.localClippingEnabled,De=Ge.init(this.clippingPlanes,Oe),De===!0&&Ge.setGlobalState(this.clippingPlanes,t),ie!==null&&J.render(j.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ut(o,n,t,e),r.add(o)}else ut(i,n,t,e),r.add(i)}}),j=M.pop(),ie!==null&&ie.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=U.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ie.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let dt=null;function ft(e){dt&&dt(e)}function pt(){ht.stop()}function mt(){ht.start()}let ht=new Xo;ht.setAnimationLoop(ft),typeof self<`u`&&ht.setContext(self),this.setAnimationLoop=function(e){dt=e,et.setAnimationLoop(e),e===null?ht.stop():ht.start()},et.addEventListener(`sessionstart`,pt),et.addEventListener(`sessionend`,mt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){L(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(ne===!0)return;ie!==null&&ie.renderStart(e,t);let n=et.enabled===!0&&et.isPresenting===!0,r=N!==null&&(ue===null||n)&&N.begin(P,ue);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),et.enabled===!0&&et.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(et.cameraAutoUpdate===!0&&et.updateCamera(t),t=et.getCamera()),e.isScene===!0&&e.onBeforeRender(P,e,t,ue),j=q.get(e,M.length),j.init(t),j.state.textureUnits=W.getTextureUnits(),M.push(j),ke.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),B.setFromProjectionMatrix(ke,ce,t.reversedDepth),Oe=this.localClippingEnabled,De=Ge.init(this.clippingPlanes,Oe),A=We.get(e,te.length),A.init(),te.push(A),et.enabled===!0&&et.isPresenting===!0){let e=P.xr.getDepthSensingMesh();e!==null&&gt(e,t,-1/0,P.sortObjects)}gt(e,t,0,P.sortObjects),A.finish(),ie!==null&&ie.updateLights(j.state.lightsArray),P.sortObjects===!0&&A.sort(Ce,z),Ne=et.enabled===!1||et.isPresenting===!1||et.hasDepthSensing()===!1,Ne&&Ke.addToRenderList(A,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),De===!0&&Ge.beginShadows();let i=j.state.shadowsArray;if(J.render(i,e,t),De===!0&&Ge.endShadows(),(r&&N.hasRenderPass())===!1){let n=A.opaque,r=A.transmissive;if(j.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];vt(n,r,e,a)}Ne&&Ke.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];_t(A,e,n,n.viewport)}}else r.length>0&&vt(n,r,e,t),Ne&&Ke.render(e),_t(A,e,t)}ue!==null&&le===0&&(W.updateMultisampleRenderTarget(ue),W.updateRenderTargetMipmap(ue)),r&&N.end(P),e.isScene===!0&&e.onAfterRender(P,e,t),Ze.resetDefaultState(),de=-1,pe=null,M.pop(),M.length>0?(j=M[M.length-1],W.setTextureUnits(j.state.textureUnits),De===!0&&Ge.setGlobalState(P.clippingPlanes,j.state.camera)):j=null,te.pop(),A=te.length>0?te[te.length-1]:null,ie!==null&&ie.renderEnd()};function gt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)j.pushLightProbeGrid(e);else if(e.isLight)j.pushLight(e),e.castShadow&&j.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(B)){r&&je.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ke);let i=Ve.update(e),a=e.material;a.visible&&A.push(e,i,a,n,je.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(B))){let i=Ve.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),je.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),je.copy(e.boundingSphere.center)),je.applyMatrix4(e.matrixWorld).applyMatrix4(ke)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&A.push(e,i,c,n,je.z,s,t)}}else a.visible&&A.push(e,i,a,n,je.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)gt(i[e],t,n,r)}function _t(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;j.setupLightsView(n),De===!0&&Ge.setGlobalState(P.clippingPlanes,n),r&&H.viewport(he.copy(r)),i.length>0&&yt(i,t,n),a.length>0&&yt(a,t,n),o.length>0&&yt(o,t,n),H.buffers.depth.setTest(!0),H.buffers.depth.setMask(!0),H.buffers.color.setMask(!0),H.setPolygonOffset(!1)}function vt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(j.state.transmissionRenderTarget[r.id]===void 0){let e=Ie.has(`EXT_color_buffer_half_float`)||Ie.has(`EXT_color_buffer_float`);j.state.transmissionRenderTarget[r.id]=new it(1,1,{generateMipmaps:!0,type:e?y:h,minFilter:m,samples:Math.max(4,Le.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Y.workingColorSpace})}let a=j.state.transmissionRenderTarget[r.id],o=r.viewport||he;a.setSize(o.z*P.transmissionResolutionScale,o.w*P.transmissionResolutionScale);let s=P.getRenderTarget(),c=P.getActiveCubeFace(),l=P.getActiveMipmapLevel();P.setRenderTarget(a),P.getClearColor(ve),ye=P.getClearAlpha(),ye<1&&P.setClearColor(16777215,.5),P.clear(),Ne&&Ke.render(n);let u=P.toneMapping;P.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),j.setupLightsView(r),De===!0&&Ge.setGlobalState(P.clippingPlanes,r),yt(e,n,r),W.updateMultisampleRenderTarget(a),W.updateRenderTargetMipmap(a),Ie.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,bt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(W.updateMultisampleRenderTarget(a),W.updateRenderTargetMipmap(a))}P.setRenderTarget(s,c,l),P.setClearColor(ve,ye),d!==void 0&&(r.viewport=d),P.toneMapping=u}function yt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&bt(o,t,n,s,l,c)}}function bt(e,t,n,r,i,a){ie!==null&&i.isNodeMaterial&&ie.setObject(e,i),e.onBeforeRender(P,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(P,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,P.renderBufferDirect(n,t,r,i,e,a),i.side=2):P.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(P,t,n,r,i,a)}function xt(e,t,n){t.isScene!==!0&&(t=Me);let r=U.get(e),i=j.state.lights,a=j.state.shadowsArray,o=i.state.version,s=He.getParameters(e,i.state,a,t,n,j.state.lightProbeGridArray),c=He.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ze.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,ot),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return Ct(e,s),d}else s.uniforms=He.getUniforms(e),ie!==null&&e.isNodeMaterial&&ie.build(e,n,s),e.onBeforeCompile(s,P),d=He.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ge.uniform),Ct(e,s),r.needsLights=Dt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=j.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function St(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Gc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function Ct(e,t){let n=U.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function wt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];O.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(O))return n}return null}function Tt(e,t,n,r,i){t.isScene!==!0&&(t=Me),W.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=ue===null?P.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:Y.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ze.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(h=P.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=U.get(r),y=j.state.lights;if(De===!0&&(Oe===!0||e!==pe)){let t=e===pe&&r.id===de;Ge.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ge.numPlanes||v.numIntersection!==Ge.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=j.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=xt(r,t,i),ie&&r.isNodeMaterial&&ie.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(H.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==de&&(de=r.id,C=!0),v.needsLights){let e=wt(j.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||pe!==e){H.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(V,`projectionMatrix`,e.projectionMatrix),T.setValue(V,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(V,Ae.setFromMatrixPosition(e.matrixWorld)),Le.logarithmicDepthBuffer&&T.setValue(V,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(V,`isOrthographic`,e.isOrthographicCamera===!0),pe!==e&&(pe=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(V,`sunShadowMap`,y.state.sunShadowMap,W),y.state.directionalShadowMap.length>0&&T.setValue(V,`directionalShadowMap`,y.state.directionalShadowMap,W),y.state.spotShadowMap.length>0&&T.setValue(V,`spotShadowMap`,y.state.spotShadowMap,W),y.state.pointShadowMap.length>0&&T.setValue(V,`pointShadowMap`,y.state.pointShadowMap,W)),i.isSkinnedMesh){T.setOptional(V,i,`bindMatrix`),T.setOptional(V,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(V,`boneTexture`,e.boneTexture,W))}i.isBatchedMesh&&(T.setOptional(V,i,`batchingTexture`),T.setValue(V,`batchingTexture`,i._matricesTexture,W),T.setOptional(V,i,`batchingIdTexture`),T.setValue(V,`batchingIdTexture`,i._indirectTexture,W),T.setOptional(V,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(V,`batchingColorTexture`,i._colorsTexture,W));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&qe.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(V,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=fu()),C){if(T.setValue(V,`toneMappingExposure`,P.toneMappingExposure),v.needsLights&&Et(E,w),a&&r.fog===!0&&Ue.refreshFogUniforms(E,a),Ue.refreshMaterialUniforms(E,r,Se,xe,j.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}Gc.upload(V,St(v),E,W)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Gc.upload(V,St(v),E,W),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(V,`center`,i.center),T.setValue(V,`modelViewMatrix`,i.modelViewMatrix),T.setValue(V,`normalMatrix`,i.normalMatrix),T.setValue(V,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Qe.update(n,x),Qe.bind(n,x)}}return x}function Et(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function Dt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return se},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return ue},this.setRenderTargetTextures=function(e,t,n){let r=U.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),U.get(e.texture).__webglTexture=t,U.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=U.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){ue=e,se=t,le=n;let r=null,i=!1,a=!1;if(e){let o=U.get(e);if(o.__useDefaultFramebuffer!==void 0){H.bindFramebuffer(V.FRAMEBUFFER,o.__webglFramebuffer),he.copy(e.viewport),R.copy(e.scissor),_e=e.scissorTest,H.viewport(he),H.scissor(R),H.setScissorTest(_e),de=-1;return}if(o.__webglFramebuffer===void 0)W.setupRenderTarget(e);else if(o.__hasExternalTextures)W.rebindTextures(e,U.get(e.texture).__webglTexture,U.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&U.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);W.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=U.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&W.useMultisampledRTT(e)===!1?U.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,he.copy(e.viewport),R.copy(e.scissor),_e=e.scissorTest}else he.copy(we).multiplyScalar(Se).floor(),R.copy(Te).multiplyScalar(Se).floor(),_e=Ee;if(n!==0&&(r=ae),H.bindFramebuffer(V.FRAMEBUFFER,r)&&H.drawBuffers(e,r),H.viewport(he),H.scissor(R),H.setScissorTest(_e),i){let r=U.get(e.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=U.get(e.textures[t]);V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=U.get(e.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,t.__webglTexture,n)}de=-1};function Ot(e){let t=U.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Le.textureFormatReadable(e.format),t.__typeReadable=Le.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=U.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){H.bindFramebuffer(V.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+s);let u=Ot(o);if(u.__formatReadable===!1){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){L(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&V.readPixels(t,n,r,i,Xe.convert(c),Xe.convert(l),a)}finally{let e=ue===null?null:U.get(ue).__webglFramebuffer;H.bindFramebuffer(V.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=U.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){H.bindFramebuffer(V.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&V.readBuffer(V.COLOR_ATTACHMENT0+s);let d=Ot(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,f),V.bufferData(V.PIXEL_PACK_BUFFER,a.byteLength,V.STREAM_READ),V.readPixels(t,n,r,i,Xe.convert(l),Xe.convert(u),0),V.bindBuffer(V.PIXEL_PACK_BUFFER,null);let p=ue===null?null:U.get(ue).__webglFramebuffer;H.bindFramebuffer(V.FRAMEBUFFER,p);let m=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await ge(V,m,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,f),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,a),V.bindBuffer(V.PIXEL_PACK_BUFFER,null),V.deleteBuffer(f),V.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;W.setTexture2D(e,0),V.copyTexSubImage2D(V.TEXTURE_2D,n,0,0,o,s,i,a),H.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Xe.convert(t.format),_=Xe.convert(t.type),v;t.isData3DTexture?(W.setTexture3D(t,0),v=V.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(W.setTexture2DArray(t,0),v=V.TEXTURE_2D_ARRAY):(W.setTexture2D(t,0),v=V.TEXTURE_2D),H.activeTexture(V.TEXTURE0),H.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,t.flipY),H.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),H.pixelStorei(V.UNPACK_ALIGNMENT,t.unpackAlignment);let y=H.getParameter(V.UNPACK_ROW_LENGTH),b=H.getParameter(V.UNPACK_IMAGE_HEIGHT),x=H.getParameter(V.UNPACK_SKIP_PIXELS),S=H.getParameter(V.UNPACK_SKIP_ROWS),C=H.getParameter(V.UNPACK_SKIP_IMAGES);H.pixelStorei(V.UNPACK_ROW_LENGTH,h.width),H.pixelStorei(V.UNPACK_IMAGE_HEIGHT,h.height),H.pixelStorei(V.UNPACK_SKIP_PIXELS,l),H.pixelStorei(V.UNPACK_SKIP_ROWS,u),H.pixelStorei(V.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=U.get(e),r=U.get(t),h=U.get(n.__renderTarget),g=U.get(r.__renderTarget);H.bindFramebuffer(V.READ_FRAMEBUFFER,h.__webglFramebuffer),H.bindFramebuffer(V.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,U.get(e).__webglTexture,i,d+n),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,U.get(t).__webglTexture,a,m+n)),V.blitFramebuffer(l,u,o,s,f,p,o,s,V.DEPTH_BUFFER_BIT,V.NEAREST);H.bindFramebuffer(V.READ_FRAMEBUFFER,null),H.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||U.has(e)){let n=U.get(e),r=U.get(t);H.bindFramebuffer(V.READ_FRAMEBUFFER,F),H.bindFramebuffer(V.DRAW_FRAMEBUFFER,oe);for(let e=0;e<c;e++)w?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,n.__webglTexture,i),T?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,r.__webglTexture,a),i===0?T?V.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):V.copyTexSubImage2D(v,a,f,p,l,u,o,s):V.blitFramebuffer(l,u,o,s,f,p,o,s,V.COLOR_BUFFER_BIT,V.NEAREST);H.bindFramebuffer(V.READ_FRAMEBUFFER,null),H.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?V.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?V.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):V.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):V.texSubImage2D(V.TEXTURE_2D,a,f,p,o,s,g,_,h);H.pixelStorei(V.UNPACK_ROW_LENGTH,y),H.pixelStorei(V.UNPACK_IMAGE_HEIGHT,b),H.pixelStorei(V.UNPACK_SKIP_PIXELS,x),H.pixelStorei(V.UNPACK_SKIP_ROWS,S),H.pixelStorei(V.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&V.generateMipmap(v),H.unbindTexture()},this.initRenderTarget=function(e){U.get(e).__webglFramebuffer===void 0&&W.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?W.setTextureCube(e,0):e.isData3DTexture?W.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?W.setTexture2DArray(e,0):W.setTexture2D(e,0),H.unbindTexture()},this.resetState=function(){se=0,le=0,ue=null,H.reset(),Ze.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return ce}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Y._getDrawingBufferColorSpace(e),t.unpackColorSpace=Y._getUnpackColorSpace()}},mu=class extends Wt{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new Zr;e.deleteAttribute(`uv`);let t=new Ba({side:1}),n=new Ba,r=new Oo(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new lr(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new xr(e,n,6),o=new Pt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new lr(e,hu(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new lr(e,hu(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new lr(e,hu(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new lr(e,hu(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new lr(e,hu(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new lr(e,hu(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function hu(e){return new Ha({color:0,emissive:16777215,emissiveIntensity:e})}var gu=`
float owH21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float owVN(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(owH21(i), owH21(i + vec2(1.0, 0.0)), u.x), mix(owH21(i + vec2(0.0, 1.0)), owH21(i + vec2(1.0, 1.0)), u.x), u.y); }
float owFB2(vec2 p){ return owVN(p) * 0.667 + owVN(p * 2.03 + 1.7) * 0.333; }
float owFB3(vec2 p){ return owVN(p) * 0.571 + owVN(p * 2.03 + 1.7) * 0.286 + owVN(p * 4.11 + 3.1) * 0.143; }
float owFB(vec2 p){ return owVN(p) * 0.5 + owVN(p * 2.03 + 1.7) * 0.25 + owVN(p * 4.11 + 3.1) * 0.125 + owVN(p * 8.17 + 5.3) * 0.0625; }
`,_u=`
vec3 owBump(vec3 pos, vec3 n, float h){
  vec3 dpx = dFdx(pos), dpy = dFdy(pos);
  float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
  float det = dot(dpx, r1);
  vec3 g = sign(det) * (dhx * r1 + dhy * r2);
  return normalize(abs(det) * n - g);
}`,vu={uTime:{value:0},uWetAll:{value:0},uSkyRefl:{value:new X(.6,.7,.85)}};function yu(e,t){e.defines={...e.defines??{},OW_DETAIL:``},e.onBeforeCompile=e=>{e.uniforms.uTime=vu.uTime,e.uniforms.uWetAll=vu.uWetAll,e.uniforms.uSkyRefl=vu.uSkyRefl,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute vec4 aSurf; varying vec4 vSurf; varying vec3 vW;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vSurf = aSurf; vW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec4 vSurf; varying vec3 vW; uniform float uTime; uniform float uWetAll; uniform vec3 uSkyRefl;
${gu}
${_u}`).replace(`#include <color_fragment>`,`#include <color_fragment>
float owHgt = 0.0, owWet = 0.0;
#ifdef OW_DETAIL
{
  float dist = length(vViewPosition);
  float mudW = vSurf.x, sandW = vSurf.y, rockW = vSurf.z, ring = vSurf.w;
  float pools = 0.0;
  // per-biome work is branched on its weight (biomes are large coherent regions) and skipped beyond 220 m
  if (dist < 220.0) {
    float fadeN = 1.0 - smoothstep(18.0, 70.0, dist);    // fine bump only near the camera (avoids shimmer)
    float fadeC = 1.0 - smoothstep(60.0, 220.0, dist);   // colour variation further out
    vec2 p = vW.xz;
    float grassW = clamp(1.0 - mudW - sandW - rockW, 0.0, 1.0);
    vec3 c = diffuseColor.rgb, detailC = vec3(0.0);
    float big = owFB2(p * 0.045), fine = owVN(p * 6.3), grit = fadeN > 0.0 ? owVN(p * 23.0) : 0.5;
    float hG = 0.0, hS = 0.0, hM = 0.0, hR = 0.0;
    if (grassW > 0.01) { // grass / dirt
      float mid = owVN(p * 0.9);
      float clump = smoothstep(0.35, 0.8, owFB3(p * 0.32 + 11.0));
      vec3 cg = c * (0.78 + 0.42 * mid) * mix(vec3(1.0), vec3(1.12, 1.06, 0.78), smoothstep(0.55, 0.8, big));
      cg = mix(cg, c * vec3(0.72, 0.86, 0.62), clump * 0.45);
      float pebble = smoothstep(0.82, 0.9, owVN(p * 4.0 + 7.0)) * (1.0 - clump);
      cg = mix(cg, vec3(0.42, 0.40, 0.37), pebble * 0.7);
      hG = fine * 0.35 + grit * 0.25 + clump * 0.5 + pebble * 0.6;
      detailC += cg * grassW;
    }
    if (sandW > 0.01) { // sand: wind ripples (crest lines warped by noise), fine grain
      float warp = owFB2(p * 0.08 + 3.0) * 9.0;
      float rq = dot(p, vec2(0.83, 0.56)) * 2.6 + warp;
      float rip = pow(0.5 + 0.5 * sin(rq), 2.2);
      vec3 cs = c * (0.9 + 0.16 * rip + 0.08 * (big - 0.5)) + (grit - 0.5) * 0.05;
      hS = rip * 0.55 + grit * 0.08 + owVN(p * 0.6) * 0.4;
      detailC += cs * sandW;
    }
    if (mudW > 0.01) { // mud: clods, wet pools
      float clod = owFB3(p * 1.4 + 2.0);
      pools = smoothstep(0.52, 0.66, owFB2(p * 0.11 + 5.0) + (fine - 0.5) * 0.08);
      vec3 cm = c * (0.72 + 0.5 * clod) * mix(1.0, 0.55, pools);
      cm = mix(cm, cm * vec3(1.15, 1.0, 0.82), smoothstep(0.6, 0.85, big) * 0.6);   // drier crust patches
      hM = clod * 0.8 + fine * 0.25 - pools * 0.7;
      detailC += cm * mudW;
    }
    if (rockW > 0.01) { // rock: cracks + grit
      float crack = 1.0 - smoothstep(0.0, 0.06, abs(owVN(p * 0.7 + 9.0) - 0.5));
      vec3 cr = c * (0.85 + 0.3 * fine) * (1.0 - crack * 0.45);
      hR = fine * 0.6 + grit * 0.3 - crack * 0.6;
      detailC += cr * rockW;
    }
    detailC += c * ((grassW > 0.01 ? 0.0 : grassW) + (sandW > 0.01 ? 0.0 : sandW) + (mudW > 0.01 ? 0.0 : mudW) + (rockW > 0.01 ? 0.0 : rockW));
    c = mix(c, detailC, fadeC);
    c *= mix(1.0, 0.62, ring * (1.0 - mudW * 0.5));
    diffuseColor.rgb = c;
    owHgt = (hG * grassW * 0.06 + hS * sandW * 0.09 + hM * mudW * 0.1 + hR * rockW * 0.08) * fadeN;
    owHgt *= (1.0 - pools * mudW * 0.8);
  }
  owWet = clamp(max(pools * mudW, ring) + uWetAll * 0.55, 0.0, 1.0);
}
#endif
`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, 0.28, owWet);`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
#ifdef OW_DETAIL
normal = owBump(-vViewPosition, normal, owHgt);
#endif`).replace(`#include <lights_fragment_maps>`,`#include <lights_fragment_maps>
iblIrradiance = vec3(0.0);
radiance = uSkyRefl * (owWet * 0.32); // analytic sky colour instead of a PMREM lookup (cheaper on mobile GPUs)`)},e.customProgramCacheKey=()=>`owf-ground-`+t+(`OW_DETAIL`in(e.defines??{})?`-d`:``)}function bu(e,t){for(let n of e)if(`OW_DETAIL`in(n.defines??{})!==t){if(t)n.defines={...n.defines??{},OW_DETAIL:``};else{let e={...n.defines??{}};delete e.OW_DETAIL,n.defines=e}n.needsUpdate=!0}}function xu(){let e=new Ba({color:2827290,roughness:.04,metalness:0,transparent:!0,opacity:.94,depthWrite:!1,envMapIntensity:.42});return e.onBeforeCompile=e=>{e.uniforms.uTime=vu.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vLoc; varying vec3 vW;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLoc = position.xy; vW = (modelMatrix * vec4(transformed, 1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec2 vLoc; varying vec3 vW; uniform float uTime;
${gu}
${_u}`).replace(`#include <color_fragment>`,`#include <color_fragment>
float rr = length(vLoc);
float shore = smoothstep(1.0, 0.72, rr + (owVN(vW.xz * 1.3) - 0.5) * 0.25);
diffuseColor.a *= shore;
diffuseColor.rgb = mix(diffuseColor.rgb * 1.6, diffuseColor.rgb, smoothstep(0.65, 0.95, shore));`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
{
  vec2 q = vW.xz;
  float w = owVN(q * 2.2 + vec2(uTime * 0.35, uTime * 0.21)) * 0.6 + owVN(q * 5.1 - vec2(uTime * 0.5, -uTime * 0.3)) * 0.4;
  float fadeW = 1.0 - smoothstep(15.0, 60.0, length(vViewPosition));
  normal = owBump(-vViewPosition, normal, w * 0.035 * fadeW);
}`)},e.customProgramCacheKey=()=>`owf-water`,e}function Su(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new zn,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=Cu(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=Cu(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function Cu(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new wn(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var wu=(e,t,n)=>Math.hypot(e-n.x,t-n.z),Tu={x:80,z:-55,rx:26,rz:38},Eu=(e,t,n)=>((e-Tu.x)/(Tu.rx+n))**2+((t-Tu.z)/(Tu.rz+n))**2;function Du(e,t){let n=e.attributes.position,r=new Float32Array(n.count*3),i=new X;for(let e=0;e<n.count;e++)t(n.getX(e),n.getY(e),n.getZ(e),i),r.set([i.r,i.g,i.b],e*3);return e.setAttribute(`color`,new wn(r,3)),e}var Ou=e=>{let t=e.index?e.toNonIndexed():e;return t.attributes.uv&&t.deleteAttribute(`uv`),t};function ku(e,t,n){let r=ef(n),i=e.attributes.position,a=new Map;for(let e=0;e<i.count;e++){let n=`${i.getX(e).toFixed(3)},${i.getY(e).toFixed(3)},${i.getZ(e).toFixed(3)}`,o=a.get(n)??[(r()-.5)*t,(r()-.5)*t,(r()-.5)*t];a.set(n,o),i.setXYZ(e,i.getX(e)+o[0],i.getY(e)+o[1],i.getZ(e)+o[2])}return e.computeVertexNormals(),e}function Au(e,t,n){e.onBeforeCompile=e=>{e.uniforms.uTime=vu.uTime,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uTime;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
      #ifdef USE_INSTANCING
      vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      #else
      vec3 ip = vec3(0.0);
      #endif
      float sw = sin(uTime * 1.7 + ip.x * 0.21 + ip.z * 0.17) + 0.45 * sin(uTime * 3.1 + ip.x * 0.7);
      transformed.x += sw * ${t.toFixed(3)} * max(0.0, position.y) * max(0.0, position.y);
      transformed.z += sw * ${(t*.6).toFixed(3)} * max(0.0, position.y) * max(0.0, position.y);`)},e.customProgramCacheKey=()=>`owf-wind-`+n}var ju=[],Mu=2;function Nu(e,t,n,r,i,a){let o=new Map,s=new K;r.forEach((e,t)=>{s.setFromMatrixPosition(e);let n=`${Math.floor(s.x/40)},${Math.floor(s.z/40)}`;(o.get(n)??o.set(n,[]).get(n)).push(t)});let c={meshes:[],max:[],frac:a.frac,viewDist:a.viewDist};for(let s of o.values()){let o=new xr(t,n,s.length);s.forEach((e,t)=>{o.setMatrixAt(t,r[e]),i&&o.setColorAt(t,i[e])}),o.castShadow=!!a.shadow,o.receiveShadow=!0,o.name=a.name,o.computeBoundingSphere(),e.add(o),c.meshes.push(o),c.max.push(s.length)}ju.push(c)}function Pu(e){Mu=e;for(let t of ju)t.meshes.forEach((n,r)=>{n.count=Math.round(t.max[r]*t.frac[e])})}var Fu=new jn;function Iu(e){for(let t of ju)for(let n of t.meshes)n.boundingSphere&&(Fu.copy(n.boundingSphere).applyMatrix4(n.matrixWorld),n.visible=n.count>0&&Fu.center.distanceTo(e)-Fu.radius<t.viewDist*(Mu===0?.6:Mu===1?.8:1))}function Lu(){let e=0,t=0,n=0;for(let r of ju)for(let i of r.meshes)n++,e+=i.count,i.visible&&(t+=i.count);return{layers:ju.length,meshes:n,instances:e,visibleInstances:t,detail:Mu}}var Ru={};function zu(e,t,n,r){ju.length=0;let i=ef(4242),a=new Be,o=new K,s=new K,c=new _t,l=Uu.mud,u=Uu.sand,d=(e,t,n)=>ud(e,t)>3+n&&!Hu(e,t)&&Math.abs(t-Vu.z)>Vu.half+n&&nd(e,t)>6+n&&pd(e,t)>4+n&&wu(e,t,Uu.spawn)>Uu.spawn.r*.5+n&&!Cd(e,t)&&Math.abs(e)<150&&Math.abs(t)<150,f=(e,t,n)=>Id.every(r=>(r.x-e)**2+(r.z-t)**2>n*n),p=Ou(new $r(.22,.42,6,7,3).translate(0,3,0));{let e=p.attributes.position;for(let t=0;t<e.count;t++){let n=e.getY(t);e.setX(t,e.getX(t)+Math.sin(n*.5)*.25)}p.computeVertexNormals()}Du(p,(e,t,n,r)=>r.setRGB(.22+t*.008,.16+t*.006,.1));let m=[],h=ef(91);for(let e=0;e<6;e++){let t=e/6*Math.PI*2+h(),n=e===0?0:1.6+h()*.8,r=e===0?2.4:1.5+h()*.8;m.push(Ou(ku(new ba(1,1),.35,100+e).scale(r,r*.62,r).translate(Math.cos(t)*n,6.2+h()*1.2+(e===0?.9:0),Math.sin(t)*n)))}let g=Du(Su(m),(e,t,n,r)=>{let i=.5+.5*Math.sin(e*3.1+n*2.3+t*1.7);r.setRGB(.11+i*.07,.22+i*.1+(t-5.5)*.025,.07+i*.04)}),_=new Ba({vertexColors:!0,roughness:.85,flatShading:!0});Au(_,.0016,`leaf`);let v=new Ba({vertexColors:!0,roughness:1}),y=[],b=[],x=0;for(;y.length<95&&x++<6e3;){let e=i()*Math.PI*2,u=l.r+7+i()*34,p=l.x+Math.cos(e)*u,m=l.z+Math.sin(e)*u;if(xd(p,m)!==`ground`||!d(p,m,4)||!f(p,m,4.5))continue;let h=wd(p,m),g=.75+i()*.6;a.setFromEuler(c.set(0,i()*6.28,0)),y.push(new st().compose(s.set(p,h-.2,m),a,o.set(g,g*(.9+i()*.3),g))),b.push(new X().setHSL(.2+i()*.1,.18+i()*.2,.36+i()*.16)),Id.push({x:p,z:m}),t.createCollider(n.ColliderDesc.cylinder(3*g,.38*g).setTranslation(p,h+3*g,m),r)}Nu(e,p,v,y,null,{shadow:!0,frac:[1,1,1],viewDist:400,name:`jungle-trunks`}),Nu(e,g,_,y,b,{shadow:!0,frac:[1,1,1],viewDist:400,name:`jungle-crowns`}),Ru.jungleTrees=y.length;let S=[];for(let e=0;e<7;e++){let t=e/7*Math.PI*2;S.push(Ou(new ei(.22,1.5,3,1).rotateX(-1.05).translate(0,.35,.62).rotateY(t)))}let C=Du(Su(S),(e,t,n,r)=>r.setRGB(.12+t*.12,.3+t*.25,.08)),w=Du(Ou(ku(new ba(1,1),.3,7).scale(1,.7,1).translate(0,.45,0)),(e,t,n,r)=>r.setRGB(.15+t*.06,.3+t*.12,.1)),T=new Ba({vertexColors:!0,roughness:.8,side:2,flatShading:!0});Au(T,.05,`fern`);let E=new Ba({vertexColors:!0,roughness:.9,flatShading:!0}),D=[],O=[],ee=[],k=[];for(x=0;(D.length<900||ee.length<380)&&x++<3e4;){let e=i()<.75,t,n;if(e){let e=i()*Math.PI*2,r=l.r+1+i()*44;t=l.x+Math.cos(e)*r,n=l.z+Math.sin(e)*r}else t=(i()-.5)*290,n=(i()-.5)*290;if(xd(t,n)!==`ground`||!d(t,n,.5))continue;let r=wd(t,n);if(a.setFromEuler(c.set(0,i()*6.28,0)),D.length<900&&i()<.7){let e=.4+i()*.45;D.push(new st().compose(s.set(t,r-.05,n),a,o.set(e,e,e))),O.push(new X().setHSL(.2+i()*.1,.2+i()*.2,.32+i()*.18))}else if(ee.length<380){let e=.6+i()*1.1;ee.push(new st().compose(s.set(t,r-.1,n),a,o.set(e*(1+i()*.5),e,e))),k.push(new X().setHSL(.18+i()*.1,.18+i()*.2,.34+i()*.18))}}Nu(e,C,T,D,O,{frac:[.25,.6,1],viewDist:110,name:`ferns`}),Nu(e,w,E,ee,k,{shadow:!0,frac:[.4,.75,1],viewDist:170,name:`bushes`}),Ru.ferns=D.length,Ru.bushes=ee.length;let A=[],j=ef(55);for(let e=0;e<7;e++){let e=j()*Math.PI*2,t=j()*.18,n=.35+j()*.35,r=(j()-.5)*.5,i=.035+j()*.02,a=new zn,o=Math.cos(e)*t,s=Math.sin(e)*t,c=-Math.sin(e)*i,l=Math.cos(e)*i;a.setAttribute(`position`,new wn(new Float32Array([o-c,0,s-l,o+c,0,s+l,o+Math.cos(e)*r,n,s+Math.sin(e)*r]),3)),a.computeVertexNormals();let u=a.attributes.normal;for(let e=0;e<3;e++)u.setXYZ(e,u.getX(e)*.3,1,u.getZ(e)*.3);A.push(a)}let te=Du(Su(A),(e,t,n,r)=>r.setRGB(.16+t*.45,.26+t*.55,.08+t*.12)),M=new Ba({vertexColors:!0,roughness:.9,side:2});Au(M,.35,`grass`);let N=[],P=[];for(x=0;N.length<9e3&&x++<6e4;){let e=i()<.45,t,n;if(e){let e=i()*Math.PI*2,r=l.r-2+i()*50;t=l.x+Math.cos(e)*r,n=l.z+Math.sin(e)*r}else t=(i()-.5)*296,n=(i()-.5)*296;if(xd(t,n)!==`ground`||Hu(t,n)||Cd(t,n)||nd(t,n)<5||wu(t,n,Uu.spawn)<16)continue;let r=wd(t,n),u=.7+i()*.8;a.setFromEuler(c.set(0,i()*6.28,0)),N.push(new st().compose(s.set(t,r-.03,n),a,o.set(u,u*(.8+i()*.6),u))),P.push(new X().setHSL(.16+i()*.08,.25+i()*.2,.5+i()*.25))}Nu(e,te,M,N,P,{frac:[0,.45,1],viewDist:75,name:`grass`}),Ru.grass=N.length;let ne=[],re=[];for(x=0;ne.length<700&&x++<2e4;){let e=i()*Math.PI*2,t=l.r-4+i()*9,n=l.x+Math.cos(e)*t,r=l.z+Math.sin(e)*t;if(pd(n,r)<5||Cd(n,r))continue;let u=wd(n,r),d=1.6+i()*1.4;a.setFromEuler(c.set(0,i()*6.28,0)),ne.push(new st().compose(s.set(n,u-.05,r),a,o.set(d*.7,d*1.5,d*.7))),re.push(new X().setHSL(.13+i()*.06,.35,.42+i()*.2))}Nu(e,te,M,ne,re,{frac:[.3,.7,1],viewDist:110,name:`reeds`}),Ru.reeds=ne.length;let ie=new Ba({vertexColors:!0,roughness:.95,flatShading:!0}),ae=Du(Ou(ku(new ba(1,1),.45,21)),(e,t,n,r)=>{let i=.5+.5*Math.sin(t*9);r.setRGB(.62+i*.12,.4+i*.08,.24+i*.04)}),F=[];for(x=0;F.length<34&&x++<8e3;){let e=i()*Math.PI*2,l=u.flat+12+i()*40,d=u.x+Math.cos(e)*l,p=u.z+Math.sin(e)*l;if(Math.abs(d)>148||Math.abs(p)>148||Eu(d,p,14)<1||pd(d,p)<12||ud(d,p)<12||wu(d,p,Uu.spawn)<Uu.spawn.r+8||!f(d,p,6)||F.some(e=>(s.setFromMatrixPosition(e),Math.hypot(s.x-d,s.z-p)<7)))continue;let m=wd(d,p),h=i()<.35,g=h?2.2+i()*2:.9+i()*1.2,_=g*(h?1.1+i()*.9:.7+i()*.5);a.setFromEuler(c.set((i()-.5)*.3,i()*6.28,(i()-.5)*.3)),F.push(new st().compose(s.set(d,m+_*.25,p),a,o.set(g*(1+i()*.6),_,g))),t.createCollider(n.ColliderDesc.ball(Math.min(g,_)*.9).setTranslation(d,m+_*.25,p),r),Id.push({x:d,z:p})}Nu(e,ae,ie,F,null,{shadow:!0,frac:[1,1,1],viewDist:400,name:`sandstone`}),Ru.outcrops=F.length;let oe=Du(Ou(ku(new ba(1,0),.4,33).scale(1,.55,1).translate(0,.3,0)),(e,t,n,r)=>r.setRGB(.4+t*.1,.36+t*.12,.2)),se=new Ba({vertexColors:!0,roughness:1,flatShading:!0}),ce=[],le=[];for(x=0;ce.length<320&&x++<12e3;){let e=i()*Math.PI*2,t=6+i()*(u.r+14),n=u.x+Math.cos(e)*t,r=u.z+Math.sin(e)*t;if(Math.abs(n)>150||Math.abs(r)>150||pd(n,r)<4||ud(n,r)<4||t<u.flat&&i()<.8)continue;let l=wd(n,r),d=.35+i()*.6;a.setFromEuler(c.set(0,i()*6.28,0)),ce.push(new st().compose(s.set(n,l-.05,r),a,o.set(d,d,d))),le.push(new X().setHSL(.1+i()*.08,.25+i()*.2,.55+i()*.25))}Nu(e,oe,se,ce,le,{frac:[.35,.7,1],viewDist:160,name:`scrub`}),Ru.scrub=ce.length;let ue=[Ou(new $r(.1,.2,3.2,5).translate(0,1.6,0))],de=ef(8);for(let e=0;e<5;e++){let e=.9+de()*1.1;ue.push(Ou(new $r(.03,.08,e,4).translate(0,e/2,0).rotateZ(.6+de()*.6).rotateY(de()*6.28).translate(0,1.6+de()*1.4,0)))}let fe=Du(Su(ue),(e,t,n,r)=>r.setRGB(.36+t*.03,.3+t*.02,.24)),pe=[];for(x=0;pe.length<16&&x++<4e3;){let e=i()*Math.PI*2,t=u.flat+4+i()*40,n=u.x+Math.cos(e)*t,r=u.z+Math.sin(e)*t;if(Math.abs(n)>148||Math.abs(r)>148||pd(n,r)<6||ud(n,r)<8||Eu(n,r,8)<1)continue;let l=.8+i()*.6;a.setFromEuler(c.set((i()-.5)*.2,i()*6.28,0)),pe.push(new st().compose(s.set(n,wd(n,r)-.1,r),a,o.set(l,l,l)))}Nu(e,fe,v,pe,null,{shadow:!0,frac:[1,1,1],viewDist:260,name:`dead-trees`}),Ru.deadTrees=pe.length,Pu(Mu)}var Bu=160,Vu={z:100,half:7,len:104},Hu=(e,t)=>Math.abs(t-Vu.z)<Vu.half&&Math.abs(e)<Vu.len,Uu={spawn:{x:0,z:0,r:42},mud:{x:-72,z:40,r:40},sand:{x:88,z:-55,r:62,flat:30},ridge:{x:-102,z:-102,r:64,h:34,top:9}},Wu=Uu.ridge,Gu=Math.atan2(-Wu.z,-Wu.x),Ku=(e,t)=>({x:Wu.x+Math.cos(Gu+t)*e,z:Wu.z+Math.sin(Gu+t)*e});function qu(e){let t=Math.min(1,Math.max(0,(Wu.r-e)/(Wu.r-Wu.top)));return Wu.h*(.28*t+.72*yd(.12,.92,t))}var Ju=e=>1-yd(Wu.r-12,Wu.r+4,e),Yu=.95,Xu=5.6,Zu=[58,45,32,19],Qu=[0,.1,.35,.55,.3],$u=[],ed=[],td=[];{let e=e=>e%2==0?1:-1,t=[],n=(e,n,r,i,a,o,s,c)=>{let l=Math.abs(i-n)*(e+r)/2+Math.abs(r-e),u=Math.max(4,Math.ceil(l/2.5)),d=t.length;for(let l=+!!t.length;l<=u;l++){let d=l/u,f=Ku(e+(r-e)*d,n+(i-n)*d);t.push({...f,h:a+(o-a)*yd(0,1,d)*.15+(o-a)*d*.85,hw:4,rough:s*yd(0,.2,Math.min(d,1-d)),leg:c})}td.push(Math.floor((d+t.length-1)/2))},r=(e,n,r,i,a)=>{let o=Ku(e,n),s={x:Math.cos(Gu+n),z:Math.sin(Gu+n)},c={x:-Math.sin(Gu+n)*r,z:Math.cos(Gu+n)*r};for(let e=1;e<=8;e++){let n=e/8*Math.PI,r=Math.cos(n)*Xu,l=Math.sin(n)*Xu;t.push({x:o.x+s.x*r+c.x*l,z:o.z+s.z*r+c.z*l,h:i,hw:5.8,rough:0,leg:a})}ed.push({...o,h:i})},i=(e,t)=>{let n=Ku(e,t),r=Ed(n.x,n.z),i=Ju(e);return Math.max(r,r*(1-i)+qu(e)*i)},a=76,o=0,s=i(76,0);Zu.forEach((t,c)=>{let l=Yu*e(c),u=i(t,l);n(a,o,t+Xu,l,s,u,Qu[c],c),r(t,l,e(c),u,c),a=t-Xu,o=l,s=u}),n(a,o,6,0,s,Wu.h,Qu[Zu.length],Zu.length);let c=0;t.forEach((e,n)=>{n&&(c+=Math.hypot(e.x-t[n-1].x,e.z-t[n-1].z)),$u.push({x:e.x,z:e.z,h:e.h,hw:e.hw,rough:e.rough,s:c})})}function nd(e,t){return id(e,t).d}function rd(e,t,n){let r=$u[n],i=$u[n+1],a=i.x-r.x,o=i.z-r.z,s=Math.max(0,Math.min(1,((e-r.x)*a+(t-r.z)*o)/(a*a+o*o)));return{d:Math.hypot(e-(r.x+a*s),t-(r.z+o*s)),t:s}}function id(e,t){let n={d:1/0,i:0,t:0};if(Math.hypot(e-Wu.x,t-Wu.z)>Wu.r+30)return{d:1/0,h:0,hw:0,rough:0,s:0};for(let r=0;r<$u.length-1;r++){let i=$u[r];if(Math.abs(i.x-e)>n.d+4&&Math.abs(i.z-t)>n.d+4)continue;let a=rd(e,t,r);a.d<n.d&&(n={d:a.d,i:r,t:a.t})}let r=$u[n.i],i=$u[n.i+1],a=n.t;return{d:n.d,h:r.h+(i.h-r.h)*a,hw:r.hw+(i.hw-r.hw)*a,rough:r.rough+(i.rough-r.rough)*a,s:r.s+(i.s-r.s)*a}}var ad=[[30,-20],[48,-38],[58,-60],[70,-82],[92,-100],[116,-86],[130,-60],[126,-30],[110,-8],[88,4],[64,-2],[46,12],[26,26]],od=[[-30,-20],[-50,15],[-64,58],[-96,82],[-70,120],[-30,104],[20,100],[75,94],[115,55],[122,5],[100,-35],[70,-75],[42,-104]],sd={x:18,z:-116},cd=[[14,-14],[27,-21],[39,-27],[51,-35],[62,-42],[72,-50],[82,-62],[94,-74],[108,-80],[120,-72],[126,-58],[121,-44],[109,-36]],ld={x:96,z:-32,r:9};function ud(e,t){let n=1/0,r=[[0,-8],...cd,[ld.x,ld.z]];for(let i=0;i<r.length-1;i++){let[a,o]=r[i],[s,c]=r[i+1],l=s-a,u=c-o,d=Math.max(0,Math.min(1,((e-a)*l+(t-o)*u)/(l*l+u*u)));n=Math.min(n,Math.hypot(e-(a+l*d),t-(o+u*d)))}return n}var dd=[[-64,46],[-22,48],[-10,40]],fd=[ad,[...od,[sd.x,sd.z]],dd];function pd(e,t){let n=1/0;for(let r of fd)for(let i=0;i<r.length-1;i++){let[a,o]=r[i],[s,c]=r[i+1],l=s-a,u=c-o,d=Math.max(0,Math.min(1,((e-a)*l+(t-o)*u)/(l*l+u*u)));n=Math.min(n,Math.hypot(e-(a+l*d),t-(o+u*d)))}return n}var md={start:{x:$u[0].x,z:$u[0].z,yaw:Math.atan2($u[3].x-$u[0].x,$u[3].z-$u[0].z)},summit:{x:Wu.x,z:Wu.z}};function hd(e,t){let n=e*374761393+t*668265263|0;return n=(n^n>>>13)*1274126177,n^=n>>>16,(n&65535)/65535}function gd(e){return e*e*(3-2*e)}function _d(e,t){let n=Math.floor(e),r=Math.floor(t),i=e-n,a=t-r,o=hd(n,r),s=hd(n+1,r),c=hd(n,r+1),l=hd(n+1,r+1),u=gd(i),d=gd(a);return(o*(1-u)+s*u)*(1-d)+(c*(1-u)+l*u)*d}function vd(e,t,n=4){let r=0,i=.5,a=1;for(let o=0;o<n;o++)r+=i*_d(e*a,t*a),a*=2,i*=.5;return r}function yd(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}var bd=(e,t,n)=>Math.hypot(e-n.x,t-n.z);function xd(e,t){let n=(vd(e*.08,t*.08,2)-.5)*8;return bd(e,t,Wu)<Wu.r-6+n?`rock`:bd(e,t,Uu.mud)<Uu.mud.r+n?`mud`:bd(e,t,Uu.sand)<Uu.sand.r+n?`sand`:`ground`}var Sd=[[-70,42,5.5],[-58,56,4.2],[-50,28,3.6],[-82,18,4.2],[-66,72,3.4],[-92,60,3.8],[-44,46,3.2],[-20,-30,4.2]].map(([e,t,n])=>({x:e,z:t,r:n,depth:.5,level:0}));for(let e of Sd)e.level=Dd(e.x,e.z)-.12;function Cd(e,t){for(let n of Sd)if((e-n.x)**2+(t-n.z)**2<n.r*n.r)return n;return null}function wd(e,t){let n=Dd(e,t);for(let r of Sd){let i=Math.hypot(e-r.x,t-r.z);i<r.r+1.5&&(n-=r.depth*(1-yd(r.r*.45,r.r+1.5,i)))}return n}function Td(e,t,n,r=1/0){let i=Math.min(1,Math.max(0,(Wu.r-n)/(Wu.r-Wu.top))),a=qu(n),o=Math.atan2(t-Wu.z,e-Wu.x),s=i*(1-i)*4;a+=Math.sin(o*5+vd(e*.03,t*.03,2)*4)*3.4*s+Math.sin(o*11+vd(e*.06,t*.06,2)*5)*1.3*s;let c=1-Math.abs(2*vd(e*.07+3,t*.07-5,4)-1);a+=(c-.55)*5*s+(vd(e*.45,t*.45,2)-.5)*1.1*Math.min(1,i*3);let l=yd(.5,.68,vd(e*.05-9,t*.05+4,3))*yd(.12,.3,i)*(1-yd(.85,.97,i)),u=2.6+vd(e*.02+5,t*.02,2)*2.4,d=a/u+(vd(e*.08,t*.08,2)-.5)*1.2,f=Math.floor(d);return a=a*(1-.7*l)+(f+yd(.62,.95,d-f)-(d-a/u))*u*.7*l,a+=Math.max(0,c-.72)*9*yd(.35,.7,i)*(1-yd(.9,1,i))*yd(3,9,r),a}function Ed(e,t){return(vd(e*.018+10,t*.018-7,5)-.45)*9+yd(105,158,Math.max(Math.abs(e),Math.abs(t)))*(14+vd(e*.05,t*.05,4)*14)}function Dd(e,t){let n=Ed(e,t),r=bd(e,t,Wu);if(r<Wu.r+18){let i=Ju(r),a=id(e,t);if(i>0&&(n=Math.max(n,n*(1-i)+Td(e,t,r,a.d-a.hw)*i)),a.d<a.hw+2.6){let r=1-yd(a.hw,a.hw+2.6,a.d),i=a.rough*((vd(e*.55,t*.55,2)-.5)*1.3+(vd(e*1.7,t*1.7,1)-.5)*.35),o=yd(.3,1.5,a.h-n)*.55*Math.exp(-(((a.d-a.hw-.5)/.55)**2));n=n*(1-r)+(a.h+i)*r+o}}let i=bd(e,t,Uu.spawn),a=1-yd(Uu.spawn.r-4,Uu.spawn.r+14,i);n=n*(1-a)+(vd(e*.2,t*.2,2)-.5)*.15*a;let o=bd(e,t,Uu.mud),s=1-yd(Uu.mud.r-6,Uu.mud.r+14,o),c=-.7+(vd(e*.25,t*.25,3)-.5)*.35;n=n*(1-s)+c*s;let l=bd(e,t,Uu.sand),u=1-yd(Uu.sand.r-4,Uu.sand.r+16,l),d=yd(Uu.sand.flat,Uu.sand.flat+14,l),f=.2+((Math.sin(e*.11+Math.sin(t*.05)*2.2)*.5+.5)*3.2+vd(e*.04,t*.04,3)*2.5)*d;n=n*(1-u)+f*u;let p=(1-yd(Vu.half-1,Vu.half+9,Math.abs(t-Vu.z)))*(1-yd(Vu.len-6,Vu.len+8,Math.abs(e)));return n=n*(1-p)+.3*p,n}var Od=new X(6257210),kd=new X(8021064),Ad=new X(3811868),jd=new X(2760212),Md=new X(14268282),Nd=new X(12753500),Pd=new X(8157040),Fd=new X(10127986),Id=[],Ld=[],Rd=xu(),zd=[];function Bd(e,t){let n=(vd(e*.08,t*.08,2)-.5)*8,r=1-yd(-2,2,bd(e,t,Wu)-(Wu.r-6+n)),i=(1-r)*(1-yd(-2.5,2.5,bd(e,t,Uu.mud)-(Uu.mud.r+n))),a=(1-r)*(1-i)*(1-yd(-3,3,bd(e,t,Uu.sand)-(Uu.sand.r+n))),o=0;for(let n of Sd){let r=Math.hypot(e-n.x,t-n.z);r<n.r+3&&(o=Math.max(o,1-yd(n.r*.7,n.r+2.6,r)))}return[i,a,r,o]}function Vd(e){let t=e.attributes.position,n=new Float32Array(t.count*4);for(let e=0;e<t.count;e++)n.set(Bd(t.getX(e),t.getZ(e)),e*4);e.setAttribute(`aSurf`,new wn(n,4))}var Hd={x0:-160,x1:-30,z0:-160,z1:-30,step:1},Ud=(e,t)=>e>Hd.x0&&e<Hd.x1&&t>Hd.z0&&t<Hd.z1,Wd=new X(3881271),Gd=new X(6182219),Kd=new X(9144967),qd=new X(6775903),Jd=new X(10522744),Yd=new X(7305802);function Xd(e,t,n,r){let i=xd(t,n),a=vd(t*.15,n*.15,3),o=1-r;if(i===`mud`)e.copy(Ad).lerp(jd,a);else if(i===`sand`)e.copy(Md).lerp(Nd,a*.8);else if(i===`rock`){let r=vd(t*.9,n*.9,2),i=Math.sin(wd(t,n)*2.1+r*2)*.5+.5;e.copy(Kd).lerp(qd,yd(.06,.25,o)*.9+r*.2),e.multiplyScalar(.86+hd(Math.round(t*3),Math.round(n*3))*.22),e.lerp(Wd,yd(.2,.45,o)).lerp(Gd,yd(.2,.5,o)*i*.5),o<.12&&a>.55&&e.lerp(Yd,(a-.55)*1.6);let s=id(t,n);s.d<s.hw+1&&e.lerp(Jd,(1-yd(s.hw-1,s.hw+1,s.d))*(.75+r*.25))}else{e.copy(Od).lerp(kd,Math.min(1,a*.9+(bd(t,n,Uu.spawn)<30?.35:0))),Hu(t,n)&&e.copy(Fd).lerp(kd,a*.5),(o>.12||Math.max(Math.abs(t),Math.abs(n))>125)&&e.lerp(Pd,Math.min(1,o*4+.3));let r=id(t,n);r.d<r.hw+1&&e.lerp(Jd,(1-yd(r.hw-1,r.hw+1,r.d))*.6)}}function Zd(e,t,n,r,i,a){let o=new Sa(e,t,n,r);return o.rotateX(-Math.PI/2),o.translate(i,0,a),o}var Qd=new Qr(1,40);function $d(e,t,n){let r=Zd(320,320,Bu,Bu,0,0),i=r.attributes.position,a=new Float32Array(i.count*3),o=new X;for(let e=0;e<i.count;e++)i.setY(e,wd(i.getX(e),i.getZ(e)));r.computeVertexNormals();let s=r.attributes.normal;for(let e=0;e<i.count;e++)Xd(o,i.getX(e),i.getZ(e),s.getY(e)),a[e*3]=o.r,a[e*3+1]=o.g,a[e*3+2]=o.b;r.setAttribute(`color`,new wn(a,3)),Vd(r);{let e=r.index.array,t=[];for(let n=0;n<e.length;n+=3){let r=e[n],a=e[n+1],o=e[n+2];Ud((i.getX(r)+i.getX(a)+i.getX(o))/3,(i.getZ(r)+i.getZ(a)+i.getZ(o))/3)||t.push(r,a,o)}r.setIndex(t)}let c=new Ba({vertexColors:!0,roughness:.95,metalness:0});yu(c,`main`),zd.push(c);let l=new lr(r,c);l.receiveShadow=!0,l.name=`terrain`,e.add(l);let u=Hd.x1-Hd.x0,d=Hd.z1-Hd.z0,f=Zd(u,d,u/Hd.step,d/Hd.step,(Hd.x0+Hd.x1)/2,(Hd.z0+Hd.z1)/2),p=f.attributes.position;for(let e=0;e<p.count;e++){let t=p.getX(e),n=p.getZ(e),r=Math.abs(t-Hd.x1)<1e-6||Math.abs(t-Hd.x0)<1e-6,i=Math.abs(n-Hd.z1)<1e-6||Math.abs(n-Hd.z0)<1e-6,a=e=>Math.abs((Math.round(e)%2+2)%2-1)<1e-6,o=wd(t,n);r&&a(n)?o=(wd(t,n-1)+wd(t,n+1))/2:i&&a(t)&&(o=(wd(t-1,n)+wd(t+1,n))/2),p.setY(e,o)}f.computeVertexNormals();let m=f.attributes.normal,h=new Float32Array(p.count*3);for(let e=0;e<p.count;e++)Xd(o,p.getX(e),p.getZ(e),m.getY(e)),h[e*3]=o.r,h[e*3+1]=o.g,h[e*3+2]=o.b;f.setAttribute(`color`,new wn(h,3)),Vd(f);let g=new Ba({vertexColors:!0,roughness:.92,metalness:0,flatShading:!0});yu(g,`mountain`),zd.push(g),Ld.push(g);let _=new lr(f,g);_.receiveShadow=!0,_.name=`terrain-mountain`,e.add(_);let v=t.createRigidBody(n.RigidBodyDesc.fixed());for(let e of[r,f]){let r=new Float32Array(e.attributes.position.array),i=new Uint32Array(e.index.array);t.createCollider(n.ColliderDesc.trimesh(r,i).setFriction(.9),v)}for(let[e,r,i,a]of[[156,0,1,156],[-156,0,1,156],[0,156,156,1],[0,-156,156,1]])t.createCollider(n.ColliderDesc.cuboid(i,60,a).setTranslation(e,20,r),v);let y=Rd;for(let t of Sd){let n=new lr(Qd,y);n.rotation.x=-Math.PI/2,n.position.set(t.x,t.level,t.z),n.scale.set(t.r*1,t.r*1,1),n.renderOrder=2,n.receiveShadow=!0,n.name=`water`,e.add(n)}Ld.push(c);let b=new $r(.08,.08,1.1,6),x=new Ba({color:15921906,emissive:4202496,roughness:.6}),S=[];for(let e=-100;e<=100;e+=20)S.push(e);let C=new xr(b,x,S.length*2),w=new st,T=0;for(let e of S)for(let t of[-1,1]){let n=Vu.z+t*(Vu.half+.8);w.makeTranslation(e,wd(e,n)+.55,n),C.setMatrixAt(T++,w)}return C.castShadow=!0,e.add(C),tf(e,t,n,v),zu(e,t,n,v),l}function ef(e){return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function tf(e,t,n,r){let i=ef(1234),a=new $r(.18,.28,2.4,6),o=new ei(1.6,4.5,7),s=new ni(1,0),c=new Ba({color:4863268,roughness:1}),l=new Ba({color:3099174,roughness:.9}),u=new Ba({color:8814970,roughness:.95,flatShading:!0}),d=new xr(a,c,170),f=new xr(o,l,170),p=new xr(s,u,90);for(let t of[d,f,p])t.castShadow=!0,t.receiveShadow=!0,e.add(t);let m=new st,h=new Be,g=new K,_=new K,v=(e,t,n)=>Math.abs(t-Vu.z)>Vu.half+14&&nd(e,t)>8&&pd(e,t)>6&&bd(e,t,Wu)>Wu.r-10&&xd(e,t)===`ground`&&bd(e,t,Uu.spawn)>Uu.spawn.r+n&&bd(e,t,Uu.mud)>Uu.mud.r+n&&bd(e,t,Uu.sand)>Uu.sand.r+n,y=0,b=0;for(;y<170&&b++<5e3;){let e=(i()-.5)*290,a=(i()-.5)*290;if(!v(e,a,6)||Cd(e,a))continue;let o=wd(e,a),s=.8+i()*.7;h.setFromEuler(new _t(0,i()*6.28,0)),d.setMatrixAt(y,m.compose(_.set(e,o+1.2*s,a),h,g.set(s,s,s))),f.setMatrixAt(y,m.compose(_.set(e,o+4.4*s,a),h,g.set(s,s,s))),Id.push({x:e,z:a}),t.createCollider(n.ColliderDesc.cylinder(1.5*s,.3*s).setTranslation(e,o+1.5*s,a),r),y++}d.count=f.count=y;let x=0;for(b=0;x<90&&b++<5e3;){let e=(i()-.5)*290,a=(i()-.5)*290;if(!v(e,a,2)||Cd(e,a))continue;let o=wd(e,a),s=.5+i()*1.6;h.setFromEuler(new _t(i()*3,i()*3,i()*3)),p.setMatrixAt(x,m.compose(_.set(e,o+s*.3,a),h,g.set(s*1.3,s,s*1.1))),t.createCollider(n.ColliderDesc.ball(s*.95).setTranslation(e,o+s*.3,a),r),x++}p.count=x;let S=new Ba({color:7827818,roughness:.95,flatShading:!0}),C=new xr(new ni(1,1),S,110),w=new xr(new Da(1,0),u,700);C.castShadow=!0,C.receiveShadow=!0,w.receiveShadow=!0,C.name=`boulders`,w.name=`scree`,e.add(C,w);let T=ef(777);(e=>{let t=e.attributes.position;for(let e=0;e<t.count;e++){let n=.8+hd(Math.round(t.getX(e)*50),Math.round(t.getZ(e)*50+t.getY(e)*31))*.4;t.setXYZ(e,t.getX(e)*n,t.getY(e)*n,t.getZ(e)*n)}e.computeVertexNormals()})(C.geometry);let E=0;for(b=0;E<110&&b++<8e3;){let e=T()*Math.PI*2,i=8+Math.sqrt(T())*(Wu.r+2),a=Wu.x+Math.cos(e)*i,o=Wu.z+Math.sin(e)*i;if(Math.abs(a)>152||Math.abs(o)>152)continue;let s=id(a,o);if(s.d<s.hw+3.5)continue;let c=wd(a,o),l=.7+T()*T()*2.6;h.setFromEuler(new _t(T()*3,T()*3,T()*3)),C.setMatrixAt(E++,m.compose(_.set(a,c+l*.25,o),h,g.set(l*(1+T()*.4),l*(.6+T()*.4),l*(1+T()*.3)))),l>1.1&&t.createCollider(n.ColliderDesc.ball(l*.8).setTranslation(a,c+l*.2,o),r)}C.count=E;let D=0;for(b=0;D<700&&b++<2e4;){let e=T()*Math.PI*2,t=4+Math.sqrt(T())*(Wu.r+4),n=Wu.x+Math.cos(e)*t,r=Wu.z+Math.sin(e)*t;if(Math.abs(n)>154||Math.abs(r)>154||xd(n,r)!==`rock`)continue;let i=id(n,r);if(i.d<i.hw-.5&&T()<.85)continue;let a=.12+T()*T()*.45;h.setFromEuler(new _t(T()*6,T()*6,T()*6)),w.setMatrixAt(D++,m.compose(_.set(n,wd(n,r)+a*.2,r),h,g.set(a,a*.7,a)))}w.count=D,nf.mesh=w,nf.max=D}var nf={mesh:null,max:0};function rf(e){nf.mesh&&(nf.mesh.count=e===0?0:e===1?Math.round(nf.max*.5):nf.max)}var af=new K;function of(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;af.copy(t),af[r]=0,af.normalize();let l=.5*o/(o+s),u=1-af.angleTo(e)/c;return Math.sign(af[n])===1?u*l:s/(o+s)+l+l*(1-u)}var sf=class e extends Zr{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new K,c=new K,l=new K(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new K,h=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*h,c.y-=Math.sign(c.y)*h,c.z-=Math.sign(c.z)*h,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=of(m,c,`z`,`y`,i,n),f[a+1]=1-of(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-of(m,c,`z`,`y`,i,n),f[a+1]=1-of(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-of(m,c,`x`,`z`,i,e),f[a+1]=of(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-of(m,c,`x`,`z`,i,e),f[a+1]=1-of(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-of(m,c,`x`,`y`,i,e),f[a+1]=1-of(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=of(m,c,`x`,`y`,i,e),f[a+1]=1-of(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};function cf(e){"@babel/helpers - typeof";return cf=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},cf(e)}function lf(e,t){if(cf(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(cf(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function uf(e){var t=lf(e,`string`);return cf(t)==`symbol`?t:t+``}function Q(e,t,n){return(t=uf(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var df=new st;new _t;var ff=class{constructor(e,t,n){Q(this,`g`,void 0),Q(this,`m`,void 0),Q(this,`lod`,void 0),this.g=e,this.m=t,this.lod=n}add(e,t,n=0,r=0,i=0,a=0,o=0,s=0,c=0){if(this.lod<c)return e.dispose(),null;let l=new lr(e,t);return l.position.set(n,r,i),l.rotation.set(a,o,s),l.userData.static=!0,this.g.add(l),l}sym(e,t,n,r,i,a=0,o=0,s=0,c=0){this.add(e(),t,n,r,i,a,o,s,c),this.add(e(),t,-n,r,i,a,-o,-s,c)}box(e,t,n,r=0){return r>0&&this.lod>0?new sf(e,t,n,2,Math.min(r,e/2-.001,t/2-.001,n/2-.001)):new Zr(e,t,n)}cyl(e,t,n,r=16){return new $r(e,t,n,this.lod?r:Math.max(6,r>>1))}cylX(e,t,n=16){let r=this.cyl(e,e,t,n);return r.rotateZ(Math.PI/2),r}cylZ(e,t,n=16){let r=this.cyl(e,e,t,n);return r.rotateX(Math.PI/2),r}profile(e,t,n,r,i=.05){let a=new Ni;a.moveTo(e[0][0],e[0][1]);for(let t=1;t<e.length;t++)a.lineTo(e[t][0],e[t][1]);for(let e of[...n].sort((e,t)=>t.z-e.z)){let n=Math.max(-e.r*.95,Math.min(e.r*.95,t-e.y)),r=Math.sqrt(e.r*e.r-n*n),i=Math.asin(n/e.r);a.lineTo(e.z+r,t),a.absarc(e.z,e.y,e.r,i,Math.PI-i,!1)}a.lineTo(e[0][0],t);let o=this.lod?i:i*.6,s=new _a(a,{depth:Math.max(.01,r-2*o),bevelEnabled:!0,bevelThickness:o,bevelSize:o*.8,bevelOffset:-o*.8,bevelSegments:this.lod?3:1,curveSegments:this.lod?12:5});return s.rotateY(-Math.PI/2),s.translate(r/2-o,0,0),s}sidePoly(e,t,n,r=0){for(let i of[1,-1]){let a=new wa(new Ni(e.map(([e,t])=>new G(i>0?-e:e,t))),this.lod?6:2);a.rotateY(i>0?Math.PI/2:-Math.PI/2),this.add(a,n,i*t,0,0,0,0,0,r)}}span(e,t,n,r,i=1,a=0,o=0){let s=t[0]-e[0],c=t[1]-e[1],l=Math.hypot(s,c),u=Math.atan2(s,c),d=.012*i,f=a>0?new Zr(n,l,a):new Sa(n,l);return this.add(f,r,0,(e[1]+t[1])/2-Math.sin(u)*d,(e[0]+t[0])/2+Math.cos(u)*d,u,0,0,o)}flare(e,t,n,r,i=.14,a=.12,o=.05,s=Math.PI-.05,c=this.m.dark){for(let l of[1,-1]){let u=new Ni;u.absarc(0,0,n+a,o,s,!1),u.absarc(0,0,n,s,o,!0);let d=new _a(u,{depth:i,bevelEnabled:this.lod>0,bevelThickness:.02,bevelSize:.02,bevelSegments:1,curveSegments:this.lod?14:6});d.rotateY(-Math.PI/2),d.translate(l>0?i:0,0,0),this.add(d,c,l>0?r-i*.5:-r-i*.5,t,e)}}line(e,t,n,r=.012){let i=t[0]-e[0],a=t[1]-e[1],o=Math.hypot(i,a);for(let s of[1,-1])this.add(new Zr(.006,o,r),this.m.dark,s*n,(e[1]+t[1])/2,(e[0]+t[0])/2,Math.atan2(i,a),0,0,1)}lampRound(e,t,n,r,i,a=1){for(let o of[1,-1])this.add(this.cylZ(r*1.25,.05,18),this.m.chrome,o*e,t,n,0,0,0,1),this.add(this.cylZ(r,.06,18),i,o*e,t,n+a*.012)}lampRect(e,t,n,r,i,a,o=1,s=this.m.dark){for(let c of[1,-1])this.add(this.box(r+.05,i+.05,.05,.02),s,c*e,t,n,0,0,0,1),this.add(this.box(r,i,.05,.015),a,c*e,t,n+o*.015)}mirrors(e,t,n,r=!1){let i=r?.12:.08,a=r?.42:.16,o=r?.05:.2;for(let s of[1,-1])this.add(this.box(.16,.03,.03),this.m.dark,s*(e+.06),t-a*.3,n,0,0,0,1),this.add(this.box(i+.02,a,o,.02),this.m.dark,s*(e+.16),t,n),this.add(new Sa(o*.8,a*.8),this.m.glass,s*(e+.16),t,n-(r?.03:.11),0,Math.PI,0,1)}tyre(e,t){let n=this.lod?36:16,r=e-Math.min(.12,e*.28),i=[],a=t/2,o=Math.min(.06,t*.18);i.push(new G(r*.98,-a),new G(e-o,-a-.005));for(let t=0;t<=(this.lod?4:1);t++){let n=-Math.PI/2+t/(this.lod?4:1)*Math.PI/2;i.push(new G(e-o+Math.cos(n)*o,-a+o+Math.sin(n)*o))}for(let t=0;t<=(this.lod?4:1);t++){let n=t/(this.lod?4:1)*Math.PI/2;i.push(new G(e-o+Math.cos(n)*o,a-o+Math.sin(n)*o))}i.push(new G(e-o,a+.005),new G(r*.98,a));let s=new xa(i,n);if(s.rotateZ(Math.PI/2),s=s.toNonIndexed(),s.deleteAttribute(`uv`),this.lod){let n=Math.round(e*44),r=[s];for(let i=0;i<n;i++)for(let a of[-1,1]){let o=(i+(a>0?.5:0))/n*Math.PI*2,s=new Zr(t*.42,.035,Math.PI*2*e/n*.55).toNonIndexed();s.deleteAttribute(`uv`),s.rotateY(a*.25),s.translate(a*t*.22,e+.006,0),s.rotateX(o),r.push(s)}s=Su(r)}return s}};function pf(e){let t=new Map,n=[];e.updateMatrixWorld(!0);let r=new st().copy(e.matrixWorld).invert();for(let i of e.children){let e=i;if(!e.isMesh||!e.userData.static)continue;let a=e.geometry.index?e.geometry.toNonIndexed():e.geometry.clone();for(let e of Object.keys(a.attributes))e!==`position`&&e!==`normal`&&a.deleteAttribute(e);a.attributes.normal||a.computeVertexNormals(),df.multiplyMatrices(r,e.matrixWorld),a.applyMatrix4(df);let o=e.material;t.has(o)||t.set(o,[]),t.get(o).push(a),n.push(e)}for(let t of n)e.remove(t),t.geometry.dispose();for(let[n,r]of t){let t=Su(r);r.forEach(e=>e.dispose());let i=new lr(t,n);i.name=`static:`+n.name,i.castShadow=!0,i.receiveShadow=n.name!==`glass`,e.add(i)}}var mf={pro:{id:`pro`,label:`PRO`,desc:`Balanced: the tuned default handling.`,steerLim:1,steerRate:8,throttleExp:1,engine:1,brake:1,grip:1,side:1,softGrip:1,softDrag:1,stiff:1,travel:1,damp:1,lean:1,assist:1,yawCap:1.1,stability:0,shake:`medium`},offroad:{id:`offroad`,label:`OFF-ROAD`,desc:`Soft long-travel suspension, gentle throttle, extra grip and less drag in mud and sand.`,steerLim:1.05,steerRate:6,throttleExp:1.5,engine:.95,brake:.9,grip:.95,side:.95,softGrip:1.3,softDrag:.75,stiff:.75,travel:1.25,damp:.85,lean:1.35,assist:.6,yawCap:1,stability:0,shake:`medium`},sim:{id:`sim`,label:`SIMULATION`,desc:`Slower steering, less grip, weaker brakes, minimal assists, more weight transfer.`,steerLim:.85,steerRate:4,throttleExp:1.25,engine:.9,brake:.8,grip:.82,side:.82,softGrip:.9,softDrag:1.1,stiff:1.05,travel:1,damp:1,lean:1.6,assist:.15,yawCap:1.6,stability:0,hiSpeed:1,shake:`medium`},arcade:{id:`arcade`,label:`ARCADE`,desc:`Quick steering, strong brakes and grip, big assists, stiff and stable.`,steerLim:1.15,steerRate:12,throttleExp:.75,engine:1.2,brake:1.4,grip:1.25,side:1.2,softGrip:1.2,softDrag:.85,stiff:1.2,travel:.9,damp:1.2,lean:.6,assist:1.9,yawCap:1.25,stability:.6,shake:`low`}},hf=[`pro`,`offroad`,`sim`,`arcade`],gf=.22,_f=.32,vf=2.6,yf=40/3.6,bf=60/3.6,xf=25/3.6,Sf=28/3.6,Cf=14/3.6,wf=.7,Tf=e=>Math.min(bf,Math.max(yf,e*.46)),Ef=2.6,Df={ground:{slip:1.5,side:1,drag:.012,label:`Dirt`},sand:{slip:.75,side:.7,drag:.28,label:`Sand`},mud:{slip:.42,side:.45,drag:.55,label:`Mud`},rock:{slip:1.12,side:.82,drag:.05,label:`Rock`}},Of=class e{constructor(t,n,r,i,a,o,s=1,c=!1){Q(this,`body`,void 0),Q(this,`ctrl`,void 0),Q(this,`group`,new Ft),Q(this,`bodyVis`,new Ft),Q(this,`tailMat`,null),Q(this,`accLocal`,new G),Q(this,`lean`,{pitch:0,roll:0,vp:0,vr:0}),Q(this,`braking`,!1),Q(this,`lastV`,null),Q(this,`wheelMeshes`,[]),Q(this,`steer`,0),Q(this,`profile`,mf.pro),Q(this,`wet`,0),Q(this,`landJolt`,0),Q(this,`lastVy`,0),Q(this,`steeringWheel`,null),Q(this,`wheelDegOverride`,null),Q(this,`eye`,new K(.36,1,0)),Q(this,`glassMat`,null),Q(this,`surfaces`,[null,null,null,null]),Q(this,`extraSpin`,[0,0,0,0]),Q(this,`tracks`,void 0),Q(this,`headlights`,[]),Q(this,`beam`,void 0),Q(this,`paint`,void 0),Q(this,`lampMat`,void 0),Q(this,`rearGlow`,void 0),Q(this,`lightsOn`,!1),Q(this,`thrRamp`,0),Q(this,`capKmh`,0),Q(this,`slip`,[0,0,0,0]),Q(this,`contact`,[null,null,null,null]),Q(this,`inPuddle`,[!1,!1,!1,!1]),Q(this,`throttle`,0),Q(this,`rpm`,900),Q(this,`gear`,1),Q(this,`transfer`,`4H`),Q(this,`sel`,`A`),Q(this,`wheelForce`,[0,0,0,0]),Q(this,`wheelReq`,[0,0,0,0]),Q(this,`wheelRate`,[0,0,0,0]),Q(this,`lastRot`,[0,0,0,0]),Q(this,`ratio`,1),Q(this,`engineForce`,0),Q(this,`spec`,void 0),Q(this,`conn`,void 0),Q(this,`world`,void 0),Q(this,`scene`,void 0),Q(this,`spawnLift`,void 0),Q(this,`inertiaY`,4800),Q(this,`headless`,void 0),Q(this,`mats`,[]),Q(this,`geos`,[]),Q(this,`lod`,1),Q(this,`dirt`,0),Q(this,`dirtU`,{value:0}),Q(this,`shocks`,null),Q(this,`springs`,null),Q(this,`links`,null),Q(this,`calipers`,[]),Q(this,`envTex`,null),Q(this,`cockpitOn`,!1),this.headless=c,this.lod=s,this.tracks=i,this.spec=a,this.world=t,this.scene=r,this.transfer=this.driveModes.includes(`4H`)?`4H`:this.driveModes[0];let l=a.wheel;this.conn=[{x:l.x,y:l.y,z:l.zf},{x:-l.x,y:l.y,z:l.zf},{x:l.x,y:l.y,z:l.zr},{x:-l.x,y:l.y,z:l.zr}],this.spawnLift=Math.max(1.4,-(l.y-a.susp.rest-l.r)+.15);let u=a.chassis,d=a.cabin,f=a.inertia??[a.mass/12*((2*u.hy)**2+(2*u.hz)**2)*1.5,a.mass/12*((2*u.hx)**2+(2*u.hz)**2)*1.5,a.mass/12*((2*u.hx)**2+(2*u.hy)**2)*2.2],p=n.RigidBodyDesc.dynamic().setTranslation(0,2,0).setCanSleep(!1).setLinearDamping(.02).setAngularDamping(.4);this.body=t.createRigidBody(p);let m=n.ColliderDesc.cuboid(u.hx,u.hy,u.hz).setTranslation(0,u.y,0).setFriction(.4).setMassProperties(a.mass,{x:a.com[0],y:a.com[1],z:a.com[2]},{x:f[0],y:f[1],z:f[2]},{x:0,y:0,z:0,w:1});t.createCollider(m,this.body),this.inertiaY=f[1],t.createCollider(n.ColliderDesc.cuboid(d.hx,d.hy,d.hz).setTranslation(0,d.y,d.z).setDensity(0),this.body),this.ctrl=t.createVehicleController(this.body),this.ctrl.indexUpAxis=1,this.ctrl.setIndexForwardAxis=2;for(let e=0;e<4;e++){let t=this.conn[e],n=a.susp;this.ctrl.addWheel(t,{x:0,y:-1,z:0},{x:-1,y:0,z:0},n.rest,l.r),this.ctrl.setWheelSuspensionStiffness(e,n.stiffness),this.ctrl.setWheelSuspensionCompression(e,n.compression),this.ctrl.setWheelSuspensionRelaxation(e,n.relaxation),this.ctrl.setWheelMaxSuspensionTravel(e,n.travel),this.ctrl.setWheelMaxSuspensionForce(e,12e4*(a.mass/1650)),this.ctrl.setWheelFrictionSlip(e,Df.ground.slip),this.ctrl.setWheelSideFrictionStiffness(e,1)}c||(this.setProfile(e.defaultProfile),this.buildModel(o),r.add(this.group))}dispose(){this.world.removeVehicleController(this.ctrl),this.world.removeRigidBody(this.body),!this.headless&&(this.scene.remove(this.group),this.disposeVisual())}setPaint(e){this.paint?.color.set(e)}setEnv(e,t){this.envTex=e;for(let n of this.mats){let r=n;`envMapIntensity`in r&&(r.envMap!==e&&(r.envMap=e,r.needsUpdate=!0),r.envMapIntensity=t*(r.userData.envK??1))}}rebuildVisual(e){let t=this.paint.color.getHex();this.disposeVisual(),this.lod=e,this.buildModel(t),this.envTex&&this.setEnv(this.envTex,1)}disposeVisual(){for(let e of[...this.group.children])this.group.remove(e);this.group.traverse(()=>{});for(let e of this.geos)e.dispose();for(let e of[...this.headlights,this.beam])e?.dispose();for(let e of this.mats)e.dispose();this.geos=[],this.mats=[],this.headlights=[],this.wheelMeshes=[],this.calipers=[],this.shocks=this.springs=this.links=null}modelStats(){let e=0,t=0,n=[];return this.group.traverse(r=>{let i=r;if(!i.isMesh||!i.visible)return;let a=i.geometry,o=(a.index?a.index.count:a.attributes.position.count)/3*(i.isInstancedMesh?i.count:1);e++,t+=o;let s=i.material;n.push({name:i.name,mat:s.name,color:s.color?.getHex()??0,tris:o})}),{draws:e,tris:Math.round(t),parts:n}}buildModel(e){let t=this.group,n=this.spec,r=this.lod>0,i=(e,t,n=1)=>{let r=new Ba(t);return r.name=e,r.userData.envK=n,r},a=r?new Va({color:e,roughness:.42,metalness:.45,clearcoat:.85,clearcoatRoughness:.12}):new Ba({color:e,roughness:.45,metalness:.35});a.name=`paint`,a.userData.envK=.8;let o=this.dirtU;a.onBeforeCompile=e=>{e.uniforms.uDirt=o,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vCarPos;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vCarPos = position;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vCarPos;
uniform float uDirt;`).replace(`#include <color_fragment>`,`#include <color_fragment>
        float dn = sin(vCarPos.z * 7.1 + vCarPos.x * 3.0) * 0.06 + sin(vCarPos.z * 23.0 + vCarPos.y * 17.0) * 0.03;
        float dm = uDirt * (1.0 - smoothstep(-0.35, 0.25 + uDirt * 0.35, vCarPos.y + dn));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.12, 0.08), clamp(dm, 0.0, 0.92));`)},a.customProgramCacheKey=()=>`owf-paint-dirt`;let s=r?new Va({color:791580,roughness:.04,metalness:.1,clearcoat:1,clearcoatRoughness:.03,side:2}):new Ba({color:1384491,roughness:.1,metalness:.6,side:2});s.name=`glass`,s.userData.envK=1.6;let c={paint:this.paint=a,dark:i(`dark`,{color:1776670,roughness:.78,metalness:.05},.3),steel:i(`steel`,{color:2895667,roughness:.5,metalness:.6},.6),glass:s,chrome:i(`chrome`,{color:14212064,roughness:.16,metalness:1},1.4),lamp:this.lampMat=i(`lamp`,{color:16774872,emissive:16773568,emissiveIntensity:2,roughness:.2}),tail:i(`tail`,{color:7340032,emissive:16718362,emissiveIntensity:1.2,roughness:.25}),amber:i(`amber`,{color:8014336,emissive:16752640,emissiveIntensity:1.5,roughness:.25}),accent:i(`accent`,{color:n.accent??15526110,roughness:.5,metalness:.1}),rubber:i(`rubber`,{color:1447446,roughness:.92,metalness:0},.15),alloy:i(`alloy`,{color:n.rim.color,roughness:n.rim.rough,metalness:n.rim.metal},1.1),caliper:i(`caliper`,{color:n.spring,roughness:.4,metalness:.3})};this.mats.push(...Object.values(c));let l=new ff(t,c,this.lod);n.build(l,n),this.buildInterior(l),pf(t),t.traverse(e=>{let t=e;t.isMesh&&this.geos.push(t.geometry)}),this.bodyVis=new Ft,this.bodyVis.name=`body:sprung`;for(let e of[...t.children])this.bodyVis.add(e);t.add(this.bodyVis),this.tailMat=c.tail,this.glassMat=c.glass;let u=n.wheel.r,d=n.wheel.w,f=u-Math.min(.12,u*.28),p=l.tyre(u,d),m=this.rimGeometry(l,f,d),h=new Zr(d*.32,f*.4,f*.28);this.geos.push(p,m,h);for(let e=0;e<4;e++){let n=e%2==0?1:-1,i=new Ft,a=new Ft,o=new lr(p,c.rubber);o.castShadow=!0,o.name=`wheel:tyre`;let s=new lr(m,c.alloy);if(s.castShadow=r,s.name=`wheel:rim`,a.add(o,s),a.scale.x=n,i.add(a),r){let e=new lr(h,c.caliper);e.name=`wheel:caliper`,e.position.set(n*d*.08,f*.5,-f*.38),e.rotation.x=.6,i.add(e),this.calipers.push(e)}t.add(i),this.wheelMeshes.push(i)}let g=e=>(this.geos.push(e),e),_=g(Su([new $r(.04,.04,.55,r?10:6).translate(0,-.22,0).toNonIndexed(),new $r(.018,.018,.5,6).translate(0,.25,0).toNonIndexed()].map(e=>(e.deleteAttribute(`uv`),e))));if(this.shocks=new xr(_,c.steel,4),this.shocks.name=`susp:dampers`,t.add(this.shocks),r){let e=[];for(let t=0;t<=84;t++){let n=t/14*Math.PI*2;e.push(new K(Math.cos(n)*.075,-.4+t/84*.8,Math.sin(n)*.075))}let n=g(new ka(new fi(e),84,.013,5));this.springs=new xr(n,c.caliper,4),this.springs.name=`susp:springs`,t.add(this.springs)}if(n.axle===`solid`){let e=g(Su([new $r(.05,.05,(n.wheel.x-d*.5)*2,8).rotateZ(Math.PI/2).toNonIndexed(),new Ea(.17,r?12:6,r?8:4).scale(1,1,.8).translate(.15,0,0).toNonIndexed(),new $r(.04,.04,.9,6).rotateX(Math.PI/2).translate(.15,0,.45).toNonIndexed()].map(e=>(e.deleteAttribute(`uv`),e))));this.links=new xr(e,c.steel,2),this.links.name=`susp:axles`}else{let e=g(Su([new Zr(1,.04,.05).translate(.5,0,.14).rotateY(-.25).toNonIndexed(),new Zr(1,.04,.05).translate(.5,0,-.14).rotateY(.25).toNonIndexed()].map(e=>(e.deleteAttribute(`uv`),e))));this.links=new xr(e,c.steel,4),this.links.name=`susp:wishbones`}t.add(this.links);for(let e of[this.shocks,this.springs,this.links])e&&(e.castShadow=r,e.frustumCulled=!1,e.instanceMatrix.setUsage(se));let v=n.lamp;for(let e of[-v.x,v.x]){let n=new Eo(16773584,0,45,.5,.5,1.2);n.position.set(e,v.y,v.z),n.target.position.set(e*1.5,-.6,v.z+10),t.add(n,n.target),this.headlights.push(n)}this.rearGlow=new Oo(16719888,0,9,2),this.rearGlow.visible=!1,this.rearGlow.position.set(0,v.y,-n.chassis.hz-.3),t.add(this.rearGlow),this.beam=new Eo(16773584,0,70,.42,.6,1),this.beam.position.set(0,v.y+.25,v.z),this.beam.target.position.set(0,-1,v.z+14),this.beam.shadow.mapSize.set(1024,1024),this.beam.shadow.camera.near=.5,this.beam.shadow.camera.far=70,this.beam.shadow.bias=-8e-4,t.add(this.beam,this.beam.target),this.sync()}buildInterior(e){let t=e.m,n=this.spec.cabin,r=this.lod>0,i=this.group,a=n.z+n.hz,o=n.y-n.hy,s=Math.min(.42,n.hx*.45),c=n.y+n.hy-.3,l=a-.3,u=Math.max(o+.2,c-.36);e.add(e.box(n.hx*1.9,.16,.34),t.dark,0,u,l),e.add(e.box(n.hx*1.9,.3,.1),t.dark,0,u-.2,l-.12),e.add(e.box(.42,.12,.14),t.dark,s,u+.1,l-.1);for(let n of[-.09,.09])e.add(new Qr(.055,r?24:10),t.accent,s+n,u+.05,l-.18,0,Math.PI,0);for(let n of[-.09,.09])e.add(new Ca(.055,.064,r?24:10),t.chrome,s+n,u+.05,l-.181,0,Math.PI,0);e.add(e.box(.22,.12,.02),t.steel,0,u-.12,l-.18);for(let n of[s,-s])e.add(e.box(.46,.1,.48,.03),t.rubber,n,c-.62,l-.95),e.add(e.box(.46,.6,.1,.03),t.rubber,n,c-.3,l-1.22,-.18);let d=-.42,f=l-.3,p=u+.02;e.add(e.box(.11,.09,.14),t.dark,s,p,f+.06,d),e.add(e.box(.06,.012,.03),t.steel,s+.13,p+.03,f+.06,d);let m=new Ft;m.position.set(s,p,f),m.rotation.x=d,i.add(m);let h=new Ft;h.name=`steering-wheel`,m.add(h);let g=(e,t,n=0,r=0,i=0,a=0,o=0,s=0)=>{let c=new lr(e,t);return c.position.set(n,r,i),c.rotation.set(a,o,s),c.userData.static=!0,h.add(c),c},_=.19;g(new Oa(_,.022,r?12:6,r?48:20),t.rubber),g(new $r(.07,.075,.05,r?24:10),t.rubber,0,0,-.02,Math.PI/2),g(new Oa(_,.0235,6,10,.5),t.steel,0,0,0,0,0,Math.PI/2-.25);for(let e of[Math.PI,0,-Math.PI/2])g(new Zr(.14,.03,.016),t.steel,Math.cos(e)*.115,Math.sin(e)*.115,-.01,0,0,e);for(let e of[-.1,.1])g(new Zr(.03,.014,.012),t.steel,e,.02,-.03);g(new $r(.035,.045,.2,10),t.steel,0,0,.12,Math.PI/2),pf(h),h.traverse(e=>{let t=e;t.isMesh&&this.geos.push(t.geometry)}),this.steeringWheel=h,this.eye.set(s,c,l-.8)}static wheelTurn(e){return ze.clamp(e*14,-7.8,7.8)}setCockpit(e){this.cockpitOn=e;let t=this.glassMat;t&&(t.transparent=e,t.opacity=e?.12:1,t.depthWrite=!e,t.needsUpdate=!0)}rimGeometry(e,t,n){let r=e.lod>0,i=this.spec.rim.style,a=[],o=e=>{let t=e.index?e.toNonIndexed():e;t.attributes.uv&&t.deleteAttribute(`uv`),a.push(t)},s=r?28:12,c=n*.5-(i===`truck`?.1:.04);if(o(new $r(t,t,n*.92,s,1,!0).rotateZ(Math.PI/2)),o(new Oa(t,.015,4,s).rotateY(Math.PI/2).translate(n*.46,0,0)),o(new $r(t*.25,t*.3,.08,r?14:8).rotateZ(Math.PI/2).translate(c,0,0)),r&&o(new $r(t*.72,t*.72,.025,24).rotateZ(Math.PI/2).translate(-n*.05,0,0)),i===`steel`||i===`truck`){o(new $r(t*.97,t*.97,.02,s).rotateZ(Math.PI/2).translate(c-.01,0,0));let e=i===`truck`?8:5;for(let n=0;n<e&&r;n++){let r=n/e*Math.PI*2;o(new Oa(t*.12,.012,4,10).rotateY(Math.PI/2).translate(c+.006,Math.cos(r)*t*.62,Math.sin(r)*t*.62))}i===`truck`&&o(new $r(t*.45,t*.45,.1,16).rotateZ(Math.PI/2).translate(c+.04,0,0))}else{let e=i===`twin`?12:i===`rally`?5:6;for(let n=0;n<e;n++){let r=n/e*Math.PI*2+(i===`twin`&&n%2?-.12:0),a=new Zr(.03,t*.75,i===`rally`?t*.3:i===`twin`?t*.09:t*.18);a.translate(c,t*.55,0),a.rotateX(r),o(a)}}let l=i===`truck`?10:6;for(let e=0;e<l&&r;e++){let n=e/l*Math.PI*2;o(new $r(.014,.014,.04,6).rotateZ(Math.PI/2).translate(c+.04,Math.cos(n)*t*.18,Math.sin(n)*t*.18))}return Su(a)}reset(e,t,n,r){this.body.setTranslation({x:e,y:t,z:n},!0);let i=new Be().setFromEuler(new _t(0,r,0));this.body.setRotation({x:i.x,y:i.y,z:i.z,w:i.w},!0),this.body.setLinvel({x:0,y:0,z:0},!0),this.body.setAngvel({x:0,y:0,z:0},!0),this.lastV=null,this.accLocal.set(0,0),this.lean={pitch:0,roll:0,vp:0,vr:0},this.braking=!1,this.steer=0,this.tracks?.reset()}forward(e=new K){let t=this.body.rotation();return e.set(0,0,1).applyQuaternion(new Be(t.x,t.y,t.z,t.w))}forwardSpeed(){let e=this.body.linvel(),t=this.forward();return e.x*t.x+e.y*t.y+e.z*t.z}surface(){let e={ground:0,mud:0,sand:0,rock:0},t=!1;for(let n of this.surfaces)n&&(e[n]++,t=!0);return t?Object.keys(e).reduce((t,n)=>e[n]>e[t]?n:t):`ground`}get driveModes(){return this.spec.drive??[`4H`]}setTransfer(e){let t=Math.abs(this.forwardSpeed())*3.6;if(!this.driveModes.includes(e))return{ok:!1,msg:`${e} is not available on the ${this.spec.name}`};if(e===this.transfer)return{ok:!0,msg:e};if(e===`4L`||this.transfer===`4L`){if(t>8)return{ok:!1,msg:`4L rejected: slow below 8 km/h to shift ${e===`4L`?`into`:`out of`} low range (now ${t.toFixed(0)} km/h)`}}else if(t>60)return{ok:!1,msg:`Slow below 60 km/h to shift to ${e}`};return this.transfer=e,{ok:!0,msg:e}}setProfile(e){let t=this.profile=mf[e]??mf.pro,n=this.spec.susp;for(let e=0;e<4;e++)this.ctrl.setWheelSuspensionStiffness(e,n.stiffness*t.stiff),this.ctrl.setWheelSuspensionCompression(e,n.compression*t.damp),this.ctrl.setWheelSuspensionRelaxation(e,n.relaxation*t.damp),this.ctrl.setWheelMaxSuspensionTravel(e,n.travel*t.travel)}setGear(e){let t=this.forwardSpeed()*3.6;return e===this.sel?{ok:!0,msg:e}:e===`P`&&Math.abs(t)>1?{ok:!1,msg:`Stop the vehicle to select P`}:e===`R`&&t>2?{ok:!1,msg:`Stop before selecting R (${Math.round(t)} km/h)`}:(e===`D`||e===`A`)&&t<-2?{ok:!1,msg:`Stop before selecting ${e===`A`?`Auto`:`D`}`}:(this.sel=e,{ok:!0,msg:e})}step(t,n){let r=this.ctrl,i=this.forwardSpeed();{let e=0,n=0;for(let t of this.surfaces)t===`mud`?e++:t===`sand`&&n++;let r=Math.min(1,(Math.abs(i)+1)/6);e?this.dirt=Math.min(1,this.dirt+t*.08*(e/4)*r):n&&this.dirt<.3&&(this.dirt=Math.min(.3,this.dirt+t*.01*r))}let a=this.spec,o=this.profile,s=(a.steerLow-(a.steerLow-a.steerHigh)*Math.min(1,Math.abs(i)/16))*o.steerLim,c=n.steer*s;this.steer+=(c-this.steer)*Math.min(1,t*o.steerRate);let l=n.throttle>0?n.throttle**+o.throttleExp:0;this.thrRamp=l>this.thrRamp?Math.min(l,this.thrRamp+t/wf):Math.max(l,this.thrRamp-t*6),n={...n,throttle:this.thrRamp};let u=0,d=0,f=a.mass/1650*o.brake,p=this.transfer===`4L`?Ef:1,m=e.speedMode===`low`?Math.min(xf,Tf(a.topSpeed)):Tf(a.topSpeed),h=this.transfer===`4L`?Math.min(Sf,m):m,g=Math.min(Cf,a.reverse/p);this.capKmh=h*3.6;let _=a.engine*gf*p*o.engine,v=a.engine*_f*p*o.engine,y=a.engine*vf*o.engine,b=e=>e*Math.min(v,y/Math.max(.5,Math.abs(i)))*Math.max(0,1-(Math.max(0,i)/h)**4),x=e=>-_*.6*e*Math.max(0,1-Math.max(0,-i)/g),S=this.sel;S===`A`?(n.throttle>.01&&(i<-.8?d=46*f*n.throttle:u=b(n.throttle)),n.brake>.01&&(i>.8?d=Math.max(d,46*f*n.brake):n.throttle<=.01&&(u=x(n.brake)))):S===`D`||S===`R`?(n.throttle>.01&&((S===`D`?i<-.8:i>.8)?d=46*f*n.throttle:u=S===`D`?b(n.throttle):x(n.throttle)),n.brake>.01&&(d=Math.max(d,46*f*n.brake))):S===`N`?n.brake>.01&&(d=46*f*n.brake):d=200*f,n.throttle<=.01&&n.brake<=.01&&S!==`P`&&(d=S===`N`?1.5*f:6*f*p);let C=a.frontSplit??.5,w=this.transfer===`2H`?[0,0,2,2]:[2*C,2*C,2*(1-C),2*(1-C)];this.ratio=p,this.engineForce=u/p*4;let T=0,E=0,D=this.body.linvel(),O=this.body.rotation(),ee=new K(-1,0,0).applyQuaternion(new Be(O.x,O.y,O.z,O.w)),k=Math.abs(D.x*ee.x+D.y*ee.y+D.z*ee.z);for(let e=0;e<4;e++){let s=r.wheelIsInContact(e),c=null;if(this.inPuddle[e]=!1,s){let t=r.wheelContactPoint(e);if(c=t?xd(t.x,t.z):`ground`,t){var A,j;((A=this.contact)[j=e]??(A[j]=new K)).set(t.x,t.y,t.z),this.inPuddle[e]=!!Cd(t.x,t.z)}T++}else this.contact[e]=null;this.surfaces[e]=c;let l=Df[c??`ground`],m=c??`ground`,h=m===`mud`||m===`sand`,g=h?1:1-.14*this.wet-(this.inPuddle[e]?.12:0),v=a.grip[m===`rock`?`ground`:m]*l.slip*o.grip*(h?o.softGrip:1)*g,y=l.drag*(m===`ground`||m===`rock`?1:a.drag[m]*o.softDrag);if(E+=s?y+(this.inPuddle[e]?.35:0):0,s){let t=(r.wheelSuspensionForce(e)??0)*v,i=Math.abs(u*w[e])+(n.handbrake&&e>=2?3e3*f:0),a=i>t&&i>0?(i-t)/i:0;this.slip[e]=Math.min(1,a+k/7)}else this.slip[e]=0;let b=e>=2;r.setWheelFrictionSlip(e,v);let x=!b&&o.hiSpeed?1-.4*o.hiSpeed*ze.clamp((Math.abs(i)*3.6-35)/25,0,1)*Math.min(1,Math.abs(this.steer)/.25):1;r.setWheelSideFrictionStiffness(e,x*l.side*a.side*o.side*(h?1:1-.1*this.wet)*(b&&n.handbrake?.35:1)),r.setWheelSteering(e,b?0:this.steer);let S=u*w[e],C=S;if(s){let t=Math.max(Math.abs(u)/p,(r.wheelSuspensionForce(e)??0)*v);C=Math.sign(S)*Math.min(Math.abs(S),t)}r.setWheelEngineForce(e,C),this.wheelReq[e]=S,this.wheelForce[e]=C,r.setWheelBrake(e,b&&n.handbrake?160*f:d),w[e]>0&&(this.extraSpin[e]+=Math.sign(u)*(s?this.slip[e]:Math.abs(u)/_)*t*20)}r.updateVehicle(t);for(let e=0;e<4;e++){let n=r.wheelRotation(e)??0;this.wheelRate[e]=(n-this.lastRot[e])/t,this.lastRot[e]=n}{let e=this.body.linvel(),r=this.body.rotation();if(this.lastV){let n=new Be(r.x,r.y,r.z,r.w).invert(),i=new K((e.x-this.lastV.x)/t,(e.y-this.lastV.y)/t,(e.z-this.lastV.z)/t).applyQuaternion(n),a=1-Math.exp(-t*8);this.accLocal.x+=(ze.clamp(i.x,-25,25)-this.accLocal.x)*a,this.accLocal.y+=(ze.clamp(i.z,-25,25)-this.accLocal.y)*a}this.lastV={x:e.x,y:e.y,z:e.z};let a=this.lean,s=o.lean,c=ze.clamp(-this.accLocal.y*.0055*s,-.07,.07),l=ze.clamp(this.accLocal.x*.0065*s,-.08,.08),u=Math.max(0,e.y-this.lastVy);this.lastVy=e.y,this.landJolt=u,u>2.5&&(a.vp+=Math.min(.6,(u-2.5)*.08)),a.vp+=((c-a.pitch)*90-a.vp*11)*t,a.pitch+=a.vp*t,a.vr+=((l-a.roll)*80-a.vr*10)*t,a.roll+=a.vr*t,this.braking=n.brake>.05&&i>.5||n.handbrake&&Math.abs(i)>.5}this.throttle=Math.max(n.throttle,u<0?n.brake:0);let te=Math.abs(i)*3.6,M=h*3.6/130,N=[0,18,36,58,82,108,140].map(e=>e*M),P=1;for(;P<N.length-1&&te>N[P];)P++;this.gear=i<-.5||S===`R`?-1:P;let ne=N[P-1],re=N[P],ie=(this.slip[0]+this.slip[1]+this.slip[2]+this.slip[3])/4,ae=Math.min(1,(te-ne)/(re-ne)),F=P===1?900+ae*4300:2400+ae*2800;if(F+=this.throttle*(900+ie*2600)*(T?1:2.5),F=Math.min(6500,Math.max(850,F)),this.rpm+=(F-this.rpm)*Math.min(1,t*6),T>=3&&Math.abs(i)>2&&a.assist>0){let e=this.body.rotation(),r=new K(0,1,0).applyQuaternion(new Be(e.x,e.y,e.z,e.w)),s=this.body.angvel(),c=s.x*r.x+s.y*r.y+s.z*r.z,l=Math.min(1,(Math.abs(i)-2)/12),u=n.steer*a.assist*o.assist*l*Math.sign(i),d=Math.max(0,o.yawCap-Math.sign(u)*c),f=this.inertiaY*u*Math.min(1,d)*t;this.body.applyTorqueImpulse({x:r.x*f,y:r.y*f,z:r.z*f},!0)}if(o.stability>0&&T>=3){let e=this.body.angvel(),r=this.body.rotation(),a=new K(0,1,0).applyQuaternion(new Be(r.x,r.y,r.z,r.w)),s=e.x*a.x+e.y*a.y+e.z*a.z-n.steer*1.2*Math.sign(i||1);if(Math.abs(s)>.4){let e=-s*this.inertiaY*o.stability*t;this.body.applyTorqueImpulse({x:a.x*e,y:a.y*e,z:a.z*e},!0)}}if(o.hiSpeed&&T>=2){let e=Math.abs(i)*3.6,n=o.hiSpeed*ze.clamp((e-30)/25,0,1);if(n>0){let e=this.body.rotation(),r=new K(0,0,.18*this.spec.mass*this.accLocal.x*n*t).applyQuaternion(new Be(e.x,e.y,e.z,e.w));this.body.applyTorqueImpulse({x:r.x,y:r.y,z:r.z},!0)}}{let e=this.body.linvel(),t=(i>=0?h:g)*1.03,n=Math.hypot(e.x,e.z),r=T>0?Math.hypot(e.x,e.y,e.z):n;if(r>t){let n=t/r;this.body.setLinvel(T>0?{x:e.x*n,y:e.y*n,z:e.z*n}:{x:e.x*n,y:e.y,z:e.z*n},!0)}}if(T>0){let e=this.body.linvel(),n=E/4*a.mass,r=.45*Math.hypot(e.x,e.z);this.body.applyImpulse({x:-(n+r)*e.x*t,y:0,z:-(n+r)*e.z*t},!0)}}sync(){let t=this.body.translation(),n=this.body.rotation();this.group.position.set(t.x,t.y,t.z),this.group.quaternion.set(n.x,n.y,n.z,n.w),this.bodyVis.rotation.set(this.lean.pitch,0,this.lean.roll),this.tailMat&&(this.tailMat.emissiveIntensity=this.braking?5:this.lightsOn?2.6:1.2),this.rearGlow&&(this.rearGlow.visible=this.lightsOn,this.rearGlow.intensity=this.braking?6:2.2);for(let e=0;e<4;e++){let t=this.conn[e],n=this.ctrl.wheelSuspensionLength(e)??this.spec.susp.rest,r=this.wheelMeshes[e];r.position.set(t.x,t.y-n,t.z),r.rotation.y=e<2?this.steer:0;let i=r.children[0];i.rotation.x=(this.ctrl.wheelRotation(e)??0)+this.extraSpin[e];let a=this.surfaces[e];if(a&&a!==`ground`&&a!==`rock`&&this.ctrl.wheelIsInContact(e)&&!this.inPuddle[e]){let t=this.ctrl.wheelContactPoint(e);if(t){let n=this.ctrl.wheelContactNormal(e);this.tracks.add(e,new K(t.x,t.y,t.z),n?new K(n.x,n.y,n.z):new K(0,1,0),this.forward(),a)}}else this.tracks.lift(e)}this.syncSuspension(),this.steeringWheel&&(this.steeringWheel.rotation.z=this.wheelDegOverride===null?-e.wheelTurn(this.steer):this.wheelDegOverride*Math.PI/180),this.dirtU.value=this.dirt}syncRemote(t,n,r,i,a,o){this.group.position.set(t.x,t.y,t.z),this.group.quaternion.set(n.x,n.y,n.z,n.w),this.steer=r;for(let e=0;e<4;e++){let t=this.conn[e],n=this.wheelMeshes[e];n.position.set(t.x,t.y-i[e],t.z),n.rotation.y=e<2?r:0,this.extraSpin[e]+=a/this.spec.wheel.r*o,n.children[0].rotation.x=this.extraSpin[e]}this.syncSuspension(),this.steeringWheel&&(this.steeringWheel.rotation.z=-e.wheelTurn(r))}suspLengths(){return[0,1,2,3].map(e=>this.ctrl.wheelSuspensionLength(e)??this.spec.susp.rest)}static between(t,n,r,i,a,o){let s=e,c=s._v.subVectors(i,r),l=c.length();s._q.setFromUnitVectors(a,c.divideScalar(l||1)),s._s.set(a===s._x?l:1,a===s._up?l:1,1);let u=o?s._b.copy(r).add(i).multiplyScalar(.5):s._b.copy(r);t.setMatrixAt(n,s._m.compose(u,s._q,s._s))}syncSuspension(){if(!this.shocks)return;let t=e,n=this.spec.wheel,r=this.wheelMeshes.map(e=>e.position);for(let e=0;e<4;e++){let i=e%2==0?1:-1,a=r[e],o=t._a.set(i*(n.x-.28),n.y+.12,a.z-.12),s=new K(i*(n.x-n.w*.5-.1),a.y+.02,a.z-.1);if(t.between(this.shocks,e,s,o,t._up,!0),this.springs&&t.between(this.springs,e,s.clone().lerp(o,.12),o.clone().lerp(s,.06),t._up,!0),this.links&&this.spec.axle===`independent`){let r=new K(i*.32,n.y-this.spec.susp.rest+.02,a.z);t.between(this.links,e,r,new K(i*(n.x-n.w*.5-.02),a.y,a.z),t._x,!1)}}if(this.links&&this.spec.axle===`solid`)for(let[e,n,i]of[[0,0,1],[1,2,3]]){let a=r[n],o=r[i];t._q.setFromAxisAngle(new K(0,0,1),Math.atan2(a.y-o.y,a.x-o.x)),e===0&&t._q.multiply(new Be().setFromAxisAngle(t._up,Math.PI)),this.links.setMatrixAt(e,t._m.compose(t._b.set(0,(a.y+o.y)/2,(a.z+o.z)/2),t._q,t._s.set(1,1,1)))}for(let e of[this.shocks,this.springs,this.links])e&&(e.instanceMatrix.needsUpdate=!0)}};Q(Of,`defaultProfile`,`pro`),Q(Of,`speedMode`,`normal`),Q(Of,`_m`,new st),Q(Of,`_q`,new Be),Q(Of,`_v`,new K),Q(Of,`_a`,new K),Q(Of,`_b`,new K),Q(Of,`_s`,new K),Q(Of,`_up`,new K(0,1,0)),Q(Of,`_x`,new K(1,0,0));var kf=new X(1379848),Af=new X(10517064),jf=class{constructor(e,t=4e3){Q(this,`max`,void 0),Q(this,`geo`,new zn),Q(this,`pos`,void 0),Q(this,`col`,void 0),Q(this,`seg`,0),Q(this,`prev`,[]),Q(this,`count`,0),Q(this,`W`,.3),Q(this,`side`,new K),this.max=t,this.pos=new Float32Array(t*4*3),this.col=new Float32Array(t*4*4);let n=new Uint32Array(t*6);for(let e=0;e<t;e++)n.set([e*4,e*4+2,e*4+1,e*4+1,e*4+2,e*4+3],e*6);this.geo.setIndex(new wn(n,1)),this.geo.setAttribute(`position`,new wn(this.pos,3).setUsage(se)),this.geo.setAttribute(`color`,new wn(this.col,4).setUsage(se)),this.geo.setDrawRange(0,0);let r=new Ba({vertexColors:!0,transparent:!0,roughness:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:2}),i=new lr(this.geo,r);i.frustumCulled=!1,i.receiveShadow=!0,e.add(i)}lift(e){this.prev[e]=null}reset(){this.prev=[]}add(e,t,n,r,i){let a=t.clone().addScaledVector(n,.035);this.side.crossVectors(n,r).normalize().multiplyScalar(this.W/2);let o={l:a.clone().add(this.side),r:a.clone().sub(this.side),c:a},s=this.prev[e];if(!(s&&s.c.distanceToSquared(a)<.0625)){if(s&&s.c.distanceToSquared(a)<4){let e=this.seg;this.pos.set([s.l.x,s.l.y,s.l.z,s.r.x,s.r.y,s.r.z,o.l.x,o.l.y,o.l.z,o.r.x,o.r.y,o.r.z],e*12);let t=i===`mud`?kf:Af,n=[t.r,t.g,t.b,i===`mud`?.9:.65];for(let t=0;t<4;t++)this.col.set(n,e*16+t*4);this.seg=(this.seg+1)%this.max,this.count++,this.geo.setDrawRange(0,Math.min(this.count,this.max)*6),this.geo.attributes.position.needsUpdate=!0,this.geo.attributes.color.needsUpdate=!0}this.prev[e]=o}}},Mf=(e,t,n=.09)=>[{z:e.wheel.zf,y:t,r:e.wheel.r+n},{z:e.wheel.zr,y:t,r:e.wheel.r+n}];function Nf(e,t,n,r,i,a=-.45){let{steel:o,dark:s,chrome:c}=e.m,l=i-r,u=(r+i)/2;for(let t of[1,-1])e.add(e.box(.12,.16,l*.96),o,t*.48,n,u);for(let t of[r+.3,u,i-.3])e.add(e.box(.96,.1,.1),o,0,n,t,0,0,0,1);e.add(e.box(1.3,.03,l*.8),s,0,n+.1,u),e.add(e.box(.6,.26,.7,.05),o,.25,n-.02,u-l*.18,0,0,0,1),e.add(e.box(.9,.04,.8),o,0,n-.1,t.wheel.zf+.05,0,0,0,1),e.add(e.cylZ(.035,l*.75,8),o,a,n-.04,u-l*.08,0,0,0,1),e.add(e.cylZ(.09,.5,12),o,a,n-.04,u-l*.05,0,0,0,1),e.add(e.cylZ(.045,.1,10),c,a,n-.04,r+.02)}var Pf=(e,t,n,r)=>{for(let i of[1,-1])e.add(new Oa(.05,.016,6,e.lod?12:6),e.m.steel,i*t,n,r,0,Math.PI/2,0,1)};function Ff(e,t,n,r,i,a){let o=e.tyre(t,n);o.rotateY(Math.PI/2),e.add(o,e.m.rubber,r,i,a),e.add(e.cylZ(t*.6,n*.6,16),e.m.alloy,r,i,a-.03),e.add(e.cylZ(t*.2,n*.7,10),e.m.steel,r,i,a-.06,0,0,0,1)}function If(e,t,n,r,i,a=6){let{dark:o}=e.m,s=i-r;for(let a of[1,-1])e.add(e.box(.05,.06,s),o,a*t/2,n,(r+i)/2);for(let a of[r,i])e.add(e.box(t,.06,.05),o,0,n,a);for(let i=1;i<a;i++)e.add(e.box(t,.025,.05),o,0,n-.01,r+s*i/a,0,0,0,1);for(let a of[1,-1])for(let s of[r+.1,i-.1])e.add(e.box(.05,.1,.05),o,a*t/2,n-.07,s,0,0,0,1)}function Lf(e,t,n,r,i,a,o,s,c=e.m.dark){e.add(e.box(t+.08,n+.08,.05,.03),o,0,r,i),e.add(e.box(t,n,.02),c,0,r,i+.02);for(let o=0;o<a;o++)e.add(e.box(t*.98,n/a*.42,.04,.01),s,0,r-n/2+n/a*(o+.5),i+.035,0,0,0,o%2&&a>4?1:0)}function Rf(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,amber:c,accent:l}=e.m,u=-.6,d=2.3;e.add(e.profile([[-2.32,-.3],[-2.34,.62],[.95,.66],[2.25,.62],[d,.5],[d,-.26]],-.3,Mf(t,u,.11),2,.07),n),e.add(e.profile([[-2.3,.62],[-2.3,1.22],[.62,1.24],[.95,.66]],.62,[],1.9,.05),n),e.add(e.box(1.92,.07,3,.03),l,0,1.28,-.85);let f=.954;e.span([.93,.7],[.66,1.2],1.72,a),e.sidePoly([[.1,.72],[.86,.72],[.64,1.18],[.1,1.18]],f,a),e.sidePoly([[-.98,.72],[-.04,.72],[-.04,1.18],[-.98,1.18]],f,a),e.sidePoly([[-2.18,.72],[-1.12,.72],[-1.12,1.18],[-2.18,1.18]],f,a),e.sidePoly([[-1.9,1.2],[-1,1.2],[-1,1.25],[-1.9,1.25]],f,a,1);for(let t of[1,-1])for(let n of[-1.2,-1.75])e.add(e.box(.5,.012,.36),a,t*.55,1.323,n,0,0,0,1);e.sym(()=>e.box(.03,.62,.06),l,.956,.95,.03),e.sym(()=>e.box(.03,.62,.06),l,.956,.95,-1.06),e.sym(()=>e.box(.04,.5,.95),l,.957,.95,-1.65);for(let t of[.95,.04,-1.04])e.line([t,-.28],[t,.62],1.003);e.add(e.box(1.86,.03,1.32,.02),n,0,.665,1.6),e.sym(()=>e.box(.03,.08,.32),r,1.0079999999999998,.42,1.5,0,0,0,1),e.sym(()=>e.box(.06,.2,3.2),r,1.023,-.2,-.05),e.flare(t.wheel.zf,u,t.wheel.r+.12,1.06,.15,.13),e.flare(t.wheel.zr,u,t.wheel.r+.12,1.06,.15,.13),Lf(e,1,.24,.42,2.3049999999999997,4,r,i);for(let t of[1,-1])e.add(e.cylZ(.13,.05,24),r,t*.72,.42,2.3099999999999996),e.add(new Oa(.105,.018,6,e.lod?28:12),o,t*.72,.42,2.34),e.add(e.cylZ(.065,.06,18),o,t*.72,.42,2.3299999999999996),e.add(e.box(.12,.03,.02),c,t*.72,.26,2.3299999999999996,0,0,0,1);e.add(e.box(2.04,.32,.26,.05),r,0,-.08,2.36),e.add(e.box(.9,.06,.2),i,0,-.26,2.4,0,0,0,1),Pf(e,.6,-.12,2.5),e.line([-2.3449999999999998,-.28],[-2.3449999999999998,1.18],.36),e.add(new Sa(1.1,.42),a,-.12,.93,-2.3449999999999998,0,Math.PI,0);let p=.4,m=e.tyre(p,.26);m.rotateY(Math.PI/2),e.add(m,e.m.rubber,-.18,.32,-2.48),e.add(e.cylZ(p*.98,.28,24),r,-.18,.32,-2.4899999999999998);for(let t of[1,-1])e.add(e.box(.13,.5,.04,.02),r,t*.86,.68,-2.34),e.add(e.box(.09,.44,.03,.01),s,t*.86,.68,-2.355);e.add(e.box(2.04,.28,.22,.05),r,0,-.16,-2.38),If(e,1.62,1.36,-2,.35,7),e.mirrors(f,.82,.8),Nf(e,t,-.4,-2.1,2.1)}function zf(e,t){let{paint:n,dark:r,steel:i,glass:a,chrome:o,lamp:s,tail:c,amber:l,accent:u}=e.m,d=-.53,f=1.84;e.add(e.profile([[-1.98,-.3],[-1.98,.5],[1.96,.5],[2.02,.44],[2.02,-.26]],-.3,Mf(t,d,.1),f,.035),n),e.add(e.profile([[-1.95,.5],[-1.95,1.08],[.66,1.08],[.82,.5]],.5,[],1.72,.03),n),e.add(e.box(1.76,.07,2.66,.03),u,0,1.12,-.64),e.span([.798,.58],[.677,1.02],1.5,a),e.add(e.box(1.62,.05,.05),r,0,.545,.82);let p=.864;e.sidePoly([[.1,.62],[.74,.62],[.66,.98],[.1,.98]],p,a),e.sidePoly([[-1.82,.62],[-.08,.62],[-.08,.98],[-1.82,.98]],p,a),e.add(e.box(1.732,.06,.8),a,0,1.04,-.95,0,0,0,1),e.add(new Sa(.62,.36),a,-.22,.8,-1.985,0,Math.PI,0);let m=.922;e.line([.8,-.26],[.8,.5],m),e.line([-.02,-.26],[-.02,.5],m),e.line([-.02,.5],[-.02,.98],p);for(let t of[.05,.38])e.sym(()=>e.box(.03,.08,.12),r,.932,t,.74,0,0,0,1);e.sym(()=>e.box(.03,.03,.14),o,.932,.32,.05,0,0,0,1),e.add(e.box(1.3,.05,1.12,.02),n,0,.535,1.42),e.sym(()=>e.box(.24,.012,.9),i,.75,.52,1.45,0,0,0,1),e.add(e.box(1.84,.46,.05,.02),r,0,.2,2.04),Lf(e,.86,.34,.22,2.05,6,r,i),e.lampRound(.66,.26,2.075,.105,s),e.lampRound(.66,.03,2.07,.04,l),e.lampRound(.82,.03,2.07,.035,s),e.add(e.box(1.96,.2,.18,.02),i,0,-.2,2.13),Pf(e,.42,-.2,2.24),e.sym(()=>e.box(.08,.06,.62),i,f/2-.02,-.34,.38,0,0,0,1),e.flare(t.wheel.zf,d,t.wheel.r+.1,.98,.12,.07),e.flare(t.wheel.zr,d,t.wheel.r+.1,.98,.12,.07),e.sym(()=>e.box(.3,.32,.015),r,.78,-.48,t.wheel.zr-.62,0,0,0,1),e.line([-1.985,-.25],[-1.985,1],.52),Ff(e,.38,.24,-.2,.28,-2.12),e.lampRect(.8,.02,-1.99,.1,.22,c,-1),e.add(e.box(1.9,.18,.16,.02),i,0,-.22,-2.06),e.mirrors(p,.72,.68),e.add(e.box(.07,.07,.07),r,.8,1.1,.7,0,0,0,1),If(e,1.6,1.24,-1.85,.5),Nf(e,t,-.36,-1.9,1.9)}function Bf(e,t){let{paint:n,dark:r,steel:i,glass:a,chrome:o,lamp:s,tail:c,amber:l,accent:u}=e.m,d=-.6;e.add(e.profile([[-2.4,-.32],[-2.42,.58],[1,.62],[2.28,.54],[2.4,.44],[2.42,-.28]],-.32,Mf(t,d,.1),1.9,.045),n),e.add(e.profile([[-2.38,.58],[-2.38,1.2],[-2.3,1.26],[.45,1.26],[.58,1.2],[1,.62]],.58,[],1.78,.04),n),e.span([.957,.68],[.616,1.15],1.58,a);let f=.894;e.sidePoly([[.16,.7],[.88,.7],[.6,1.14],[.16,1.14]],f,a),e.sidePoly([[-.86,.7],[.02,.7],[.02,1.14],[-.86,1.14]],f,a),e.sidePoly([[-2.25,.7],[-1,.7],[-1,1.14],[-2.25,1.14]],f,a);for(let t of[.94,.09,-.93])e.line([t,-.28],[t,.58],.952);e.line([.09,.6],[.09,1.15],f),e.sym(()=>e.box(.03,.03,.15),o,.962,.42,0,0,0,0,1),e.sym(()=>e.box(.03,.03,.15),o,.962,.42,-1,0,0,0,1),e.add(e.box(.78,.07,1,.03),n,0,.63,1.62,-.06,0,0),e.add(e.box(.44,.05,.08),r,0,.66,2.1,0,0,0,1),Lf(e,1,.3,.3,2.43,5,o,o),e.lampRect(.72,.31,2.43,.3,.17,s),e.lampRect(.72,.13,2.43,.22,.06,l),e.add(e.box(2.04,.3,.26,.04),i,0,-.06,2.5),e.add(e.cylX(.12,.78,14),o,0,-.02,2.66,0,0,0,1);for(let t of[1,-1])e.add(e.cyl(.035,.035,.62,10),i,t*.42,.34,2.56,.15,0,0);e.add(e.cylX(.035,.9,10),i,0,.62,2.6);for(let t of[1,-1])e.add(e.cylX(.035,.5,10),i,t*.72,.42,2.58,0,0,t*.5);Pf(e,.7,-.05,2.64),e.flare(t.wheel.zf,d,t.wheel.r+.1,1.02,.16,.12),e.flare(t.wheel.zr,d,t.wheel.r+.1,1.02,.16,.12),e.sym(()=>e.box(.22,.05,1.6),i,1,-.36,-0),e.sym(()=>e.box(.32,.34,.015),r,.8,-.5,t.wheel.zr-.64,0,0,0,1),e.add(e.cyl(.055,.055,.85,10),r,-1.01,.85,.95),e.add(e.box(.14,.12,.22,.03),r,-1.01,1.33,.98),e.line([-2.425,-.3],[-2.425,1.18],.18);for(let t of[.52,-.42])e.add(new Sa(t>0?.5:.78,.42),a,t,.9,-2.425,0,Math.PI,0);Ff(e,.39,.25,.5,.22,-2.56);for(let t of[1,-1])e.add(e.box(.04,1.1,.04),i,-.25+t*.2,.75,-2.48,0,0,0,1);for(let t=0;t<5;t++)e.add(e.cylX(.015,.4,6),i,-.25,.3+t*.22,-2.48,0,0,0,1);e.add(e.box(1.98,.22,.2,.03),i,0,-.18,-2.5),e.lampRect(.86,.32,-2.43,.12,.3,c,-1),If(e,1.66,1.33,-2.2,.35,7),e.add(e.box(1.5,.28,1.9,.08),u,0,1.52,-.75),e.add(e.box(1.52,.05,1.92,.02),r,0,1.38,-.75,0,0,0,1),e.mirrors(f,.8,.82),Nf(e,t,-.4,-2.3,2.3)}function Vf(e,t){let{paint:n,dark:r,steel:i,glass:a,chrome:o,lamp:s,tail:c,amber:l}=e.m,u=-.6;e.add(e.profile([[-2.48,-.3],[-2.55,.3],[-2.5,.68],[.95,.74],[2.15,.64],[2.48,.5],[2.56,.05],[2.5,-.3]],-.3,Mf(t,u,.09),2,.12),n),e.add(e.profile([[-2.42,.66],[-2.28,1.27],[-2.12,1.34],[.22,1.36],[.45,1.31],[1.05,.72]],.66,[],1.84,.1),n),e.span([.989,.78],[.511,1.25],1.62,a),e.span([-2.402,.74],[-2.291,1.22],1.5,a,-1);let d=.926;e.sidePoly([[.12,.8],[.9,.8],[.45,1.24],[.12,1.24]],d,a),e.sidePoly([[-.95,.8],[0,.8],[0,1.24],[-.85,1.24]],d,a),e.sidePoly([[-2.25,.8],[-1.1,.8],[-1.1,1.24],[-2.15,1.24]],d,a),e.line([.06,.78],[.06,1.25],d),e.line([-1.02,.78],[-1.02,1.25],d);for(let t of[1,.06,-1.02])e.line([t,-.24],[t,.7],1.004);e.sym(()=>e.box(.012,.025,3.3),o,.93,.78,-.6,0,0,0,1),e.sym(()=>e.box(.02,.05,3.3),o,1.014,0,-.05);for(let t of[.35,-.65])e.sym(()=>e.box(.03,.04,.17),o,1.014,.5,t,0,0,0,1);e.flare(t.wheel.zf,u,t.wheel.r+.09,1.03,.12,.1,.1,Math.PI-.1,n),e.flare(t.wheel.zr,u,t.wheel.r+.09,1.03,.12,.1,.1,Math.PI-.1,n),e.sym(()=>e.box(.32,.05,1.2,.025),n,.36,.73,1.58,-.08,0,0,1),e.add(e.box(1.3,.56,.08,.07),o,0,.26,2.53),e.add(e.box(1.18,.46,.04),r,0,.26,2.56);for(let t=0;t<3;t++)e.add(e.box(1.16,.06,.05,.02),o,0,.1+t*.16,2.58);for(let t of[1,-1])e.add(e.box(.44,.17,.12,.05),r,t*.76,.42,2.45,0,t*.25,0),e.add(e.box(.36,.11,.05,.04),s,t*.76,.44,2.5,0,t*.25,0),e.add(e.box(.38,.025,.04),s,t*.78,.34,2.49,0,t*.25,0,1),e.add(e.box(.1,.03,.04),l,t*.95,.42,2.38,0,t*.6,0,1);e.lampRound(.74,-.06,2.53,.05,s),e.add(e.box(1.1,.07,.12,.02),o,0,-.22,2.5),e.add(e.box(1.6,.12,.05),r,0,-.08,2.54),e.sym(()=>e.box(.2,.05,1.9,.02),o,1.06,-.36,-.03);for(let t of[1,-1]){e.add(e.box(.05,.05,2.5,.02),o,t*.78,1.42,-.95);for(let n of[-2.1,.2])e.add(e.box(.06,.08,.12,.02),r,t*.78,1.38,n,0,0,0,1)}for(let t of[1,-1])e.add(e.box(.36,.17,.06,.04),c,t*.8,.56,-2.51),e.add(e.box(.06,.17,.3,.03),c,t*.97,.56,-2.38);e.add(e.box(1,.05,.04),o,0,.58,-2.53,0,0,0,1),e.add(e.box(2.02,.2,.2,.06),r,0,-.2,-2.5),e.mirrors(d,.88,.85),e.add(e.box(1.3,.11,.14,.03),r,0,1.44,.15,0,0,0,1);for(let t=-2;t<=2;t++)e.add(e.box(.2,.07,.03),s,t*.25,1.44,.23,0,0,0,1);Nf(e,t,-.36,-2.4,2.4)}function Hf(e,t){let{paint:n,dark:r,steel:i,glass:a,chrome:o,lamp:s,tail:c,amber:l}=e.m,u=-.58,d=1.9;e.add(e.profile([[-2.7,-.3],[-2.72,.24],[-.82,.24],[-.82,.62],[1.28,.62],[2.38,.52],[2.68,.42],[2.72,0],[2.68,-.3]],-.3,Mf(t,u,.1),d,.045),n),e.add(e.profile([[-.82,.6],[-.78,1.3],[-.68,1.36],[.55,1.36],[.7,1.3],[1.3,.64]],.6,[],1.76,.04),n);for(let t of[1,-1])e.add(e.box(.07,.42,1.9,.02),n,t*(d/2-.035),.44,-1.76);e.add(e.box(1.88,.42,.07,.02),n,0,.44,-2.69),e.add(e.box(1.74,.03,1.86),r,0,.255,-1.76),e.add(e.box(1.74,.36,.03),r,0,.42,-.84,0,0,0,1);for(let t of[1,-1])e.add(e.cylZ(.022,1.8,8),o,t*(d/2-.04),.7,-1.76,0,0,0,1);e.add(e.box(.5,.03,.04),r,0,.55,-2.73,0,0,0,1),e.span([1.245,.7],[.745,1.25],1.56,a),e.add(new Sa(1.3,.38),a,0,1.1,-.825,0,Math.PI,0);let f=.884;e.sidePoly([[.1,.72],[1.15,.72],[.68,1.27],[.1,1.27]],f,a),e.sidePoly([[-.7,.72],[-.02,.72],[-.02,1.27],[-.62,1.27]],f,a);for(let t of[1.2,.04,-.78])e.line([t,-.26],[t,.62],.952);e.line([.04,.62],[.04,1.28],f);for(let t of[.3,-.5])e.sym(()=>e.box(.03,.03,.15),o,.962,.45,t,0,0,0,1);e.sym(()=>e.box(.012,.03,2.1),r,.958,.22,.2,0,0,0,1),e.add(e.box(.9,.04,1,.02),n,0,.6,1.85,-.09,0,0,1),e.add(e.box(1.08,.46,.06,.05),o,0,.18,2.7),e.add(e.box(.98,.38,.04),r,0,.18,2.72);for(let t=0;t<4;t++)e.add(e.box(.94,.03,.04),i,0,.04+t*.1,2.74,0,0,0,1);for(let t of[1,-1])e.add(e.box(.42,.13,.12,.04),r,t*.72,.38,2.6,0,t*.3,0),e.add(e.box(.34,.08,.05,.03),s,t*.72,.39,2.65,0,t*.3,0),e.add(e.box(.12,.03,.04),l,t*.88,.32,2.56,0,t*.5,0,1);e.add(e.box(1.96,.24,.16,.05),r,0,-.16,2.7),e.lampRound(.72,-.15,2.79,.045,s),e.add(e.box(1,.05,.4),i,0,-.3,2.62,.2,0,0,1),Pf(e,.5,-.24,2.8);for(let t of[1,-1])e.add(e.cyl(.035,.035,.6,10),i,t*.82,.92,-.98,-.25,0,0);e.add(e.cylX(.035,1.66,10),i,0,1.2,-1.05);for(let t of[1,-1])e.add(e.cylZ(.03,.7,8),i,t*.82,.86,-1.3,.9,0,0,1);e.flare(t.wheel.zf,u,t.wheel.r+.1,1.01,.14,.1),e.flare(t.wheel.zr,u,t.wheel.r+.1,1.01,.14,.1),e.sym(()=>e.box(.16,.04,1.7,.015),i,.98,-.35,.22),e.lampRect(.88,.42,-2.73,.1,.3,c,-1),e.add(e.box(1.96,.16,.22,.04),o,0,-.22,-2.76);let p=e.tyre(.38,.24);p.rotateZ(Math.PI/2),e.add(p,e.m.rubber,0,-.18,-2.15),e.mirrors(f,.86,1.08),Nf(e,t,-.36,-2.6,2.6)}function Uf(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,accent:c}=e.m,l=-.36;e.add(e.profile([[-1.98,-.2],[-2.04,.22],[-1.95,.42],[.82,.46],[1.85,.3],[2.06,.14],[2.06,-.18]],-.2,Mf(t,l,.08),1.82,.07),n),e.add(e.profile([[-1.95,.42],[-1.52,.92],[-1.34,1],[.02,1.02],[.26,.97],[.88,.46]],.42,[],1.5,.07),n),e.span([.807,.52],[.321,.92],1.32,a),e.span([-1.898,.48],[-1.554,.88],1.24,a,-1);let u=.912;e.sidePoly([[-.05,.52],[.72,.52],[.28,.93],[-.05,.93]],.724,a),e.sidePoly([[-1.2,.52],[-.15,.52],[-.15,.94],[-1.15,.94]],.724,a),e.line([.84,-.14],[.84,.46],u),e.line([-.1,-.14],[-.1,.46],u),e.line([-1.2,-.14],[-1.2,.44],u);for(let r of[t.wheel.zf,t.wheel.zr])e.flare(r,l,t.wheel.r+.08,1.01,.22,.12,0,Math.PI,n);e.sym(()=>e.box(.1,.08,1.45,.03),r,.9500000000000001,-.2,.02),e.sym(()=>e.box(.01,.09,3),c,.918,.18,.05),e.add(e.box(.34,.012,1.4),c,0,1.03,-.65),e.sym(()=>e.cylX(.19,.012,22),c,.92,.12,.35);for(let t of[1,-1])e.add(e.box(.3,.02,.24),r,t*.4,.42,1.25,.1,0,0,1);e.add(e.box(.36,.1,.42,.04),r,0,1.06,-.05);for(let t of[1,-1])e.add(e.box(.04,.24,.3,.01),r,t*.62,1.06,-1.62);e.add(e.box(1.72,.04,.42,.015),r,0,1.19,-1.68,-.12,0,0);for(let t of[1,-1])e.add(e.box(.02,.2,.46),r,t*.87,1.17,-1.7);e.add(e.box(1.9,.04,.24),r,0,-.2,2.06),e.add(e.box(1.3,.22,.04),r,0,-.04,2.08);for(let t of[1,-1])e.add(e.box(.32,.18,.04),r,t*.72,-.06,2.07,0,0,0,1);e.add(e.box(.7,.12,.04),r,0,.17,2.08);for(let t of[1,-1])e.add(e.box(.36,.1,.1,.03),r,t*.62,.22,2,0,t*.3,0),e.add(e.box(.3,.06,.05,.02),o,t*.62,.225,2.04,0,t*.3,0);e.add(e.box(1.2,.16,.08,.04),r,0,.42,1.98);for(let t=0;t<4;t++)e.add(e.cylZ(.06,.04,14),o,-.45+t*.3,.42,2.03);e.add(e.box(1.6,.08,.3),r,0,-.18,-2);for(let t=-3;t<=3;t++)e.add(e.box(.015,.1,.28),r,t*.2,-.16,-2.02,0,0,0,1);e.lampRect(.68,.32,-2,.24,.09,s,-1),e.add(e.cylZ(.065,.2,14),i,-.5,-.12,-2.05);for(let n of[t.wheel.zf-.5,t.wheel.zr-.5])e.sym(()=>e.box(.3,.26,.015),c,.8,-.34,n,0,0,0);e.mirrors(.724,.58,.62),Nf(e,t,-.26,-1.9,1.9,-.5)}function Wf(e,t){let{paint:n,dark:r,steel:i,glass:a,chrome:o,lamp:s,tail:c,amber:l,accent:u}=e.m,d=2.3;for(let t of[1,-1])e.add(e.box(.16,.28,7),i,t*.5,.05,0);for(let t=0;t<6;t++)e.add(e.box(1,.12,.1),i,0,.05,-3.2+t*1.3,0,0,0,1);e.add(e.profile([[1.55,.42],[1.55,2.08],[1.66,2.18],[3.2,2.18],[3.33,2.05],[3.46,1.2],[3.46,.42]],.42,[],d,.08),n),e.span([3.448,1.28],[3.341,1.98],2.1,a),e.add(e.box(.06,.76,.05),r,0,1.63,3.42,-.18,0,0,1),e.add(e.box(2.2,.06,.32),r,0,2.08,3.45,.15,0,0);let f=1.154;e.sidePoly([[2.5,1.26],[3.38,1.26],[3.3,1.98],[2.5,1.98]],f,a),e.sidePoly([[1.75,1.4],[2.3,1.4],[2.3,1.98],[1.75,1.98]],f,a),e.line([2.42,.5],[2.42,2],f),e.line([3.38,.5],[3.38,1.2],f),e.sym(()=>e.box(.03,.03,.18),o,1.164,1.1,2.6,0,0,0,1);for(let t of[.25,-.05])e.sym(()=>e.box(.24,.04,.5),i,d/2-.06,t,2.95);Lf(e,1.5,.5,.82,3.47,6,r,i),e.add(e.box(2.36,.34,.32,.04),i,0,.3,3.5),e.lampRect(.86,.32,3.66,.34,.16,s),e.lampRect(.86,.6,3.48,.14,.08,l),e.add(e.cylX(.16,1,14),o,0,.34,3.7,0,0,0,1),e.add(e.box(.1,.12,.22),o,0,.34,3.86),e.add(e.box(1.6,.08,.32,.03),r,0,2.24,2.75);for(let t of[1,-1])e.add(e.cyl(.1,.11,.16,12),l,t*.62,2.35,2.75);e.add(e.box(.7,.1,.12,.03),l,0,2.32,2.75),e.mirrors(f,1.55,3.2,!0),e.add(e.cyl(.07,.07,1.9,12),o,-.95,1.4,1.42),e.add(e.cyl(.11,.11,.5,12),i,-.95,.75,1.42,0,0,0,1),e.flare(t.wheel.zf,-.45,t.wheel.r+.12,d/2-.02,.5,.06,.2,Math.PI-.15),e.sym(()=>e.cylZ(.24,.9,16),e.m.alloy,.82,.05,1),e.add(e.box(.36,.4,.6,.03),i,-.84,.1,1,0,0,0,1),e.add(e.box(2.3,.14,4.4,.03),i,0,.52,-1.35);for(let t of[1,-1]){e.add(e.box(.55,.62,1.6,.04),n,t*.88,.95,.55),e.add(e.box(.012,.5,.012),r,t*1.16,.95,.55,0,0,0,1);for(let n of[.2,.9])e.add(e.box(.02,.04,.14),o,t*1.165,1.05,n,0,0,0,1);e.add(e.box(.12,.05,4.2),r,t*1.14,.52,-1.4,0,0,0,1)}e.add(e.box(2.3,1,.1,.03),r,0,1.08,1.45);for(let t=0;t<5;t++)e.add(e.box(2.1,.04,.02),i,0,.7+t*.18,1.39,0,0,0,1);e.add(e.cyl(.42,.46,.36,18),n,0,.78,-2.85),e.add(e.box(.5,.5,.5,.05),i,0,1.15,-2.85),e.add(e.box(.3,.3,3.7,.04),u,0,2.15,-1.55,-.6,0,0),e.add(e.box(.22,.22,1.4,.03),u,0,3,-.25,-.6,0,0),e.add(e.cyl(.09,.09,1.3,12),i,0,1.55,-2.35,.32,0,0),e.add(e.cyl(.045,.045,1,10),o,0,1.95,-2.1,.32,0,0),e.add(e.cylX(.12,.34,14),i,0,3.38,.32,0,0,0,1),e.add(e.cyl(.012,.012,2.1,6),r,0,2.3,.38),e.add(new Oa(.09,.025,6,e.lod?14:6,Math.PI*1.4),o,0,1.2,.38,0,0,Math.PI*.8),e.add(e.box(.12,.14,.1),i,0,1.3,.38),e.add(e.box(.2,.18,1),i,0,-.08,-3.75),e.add(e.box(1.8,.14,.14,.03),i,0,-.08,-4.25);for(let t of[1,-1])e.add(e.box(.12,.3,.3),r,t*.8,-.08,-4.25,0,0,0,1);for(let t of[1,-1])e.add(e.box(.14,.7,.14),i,t*1,.15,-3,0,0,0,1);e.add(e.box(2.3,.1,.1),l,0,.75,-3.55),e.lampRect(1,.42,-3.56,.14,.28,c,-1),e.sym(()=>e.box(.5,.05,1.3,.02),r,d/2-.25,.25,t.wheel.zr),e.sym(()=>e.box(.5,.4,.015),r,d/2-.25,-.05,t.wheel.zr-.68,0,0,0,1)}var Gf=new Map;function Kf(e){let t=e.toString(16),n=Gf.get(t);return n||(n=new Ba({color:e,roughness:.85,metalness:.05}),n.name=`camo`,n.userData.envK=.4,Gf.set(t,n)),n}function qf(e,t,n,r,i,a,o,s=14,c,l=1.4){let u=7,d=()=>(u=u*16807%2147483647)/2147483647;for(let u=0;u<s;u++){let s=n+(r-n)*d(),f=i+(a-i)*d(),p=.25+d()*.45,m=.1+d()*.18,h=Kf(o[u%o.length]);e.sym(()=>e.box(.012,m,p),h,t+.008,f,s,d()*.6-.3,0,0,1),c!==void 0&&u%2==0&&e.add(e.box((.2+d()*.4)*l,.012,p),h,(d()-.5)*l*.6,c+.008,s,0,d(),0,1)}}function Jf(e,t,n,r){for(let i of[1,-1]){let a=e.tyre(t.wheel.r,t.wheel.w);a.rotateY(i>0?0:Math.PI),e.add(a,e.m.rubber,i*t.wheel.x,r,n),e.add(e.cylX(t.wheel.r*.55,t.wheel.w+.02,14),e.m.alloy,i*t.wheel.x,r,n)}}function Yf(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,amber:c,accent:l}=e.m,u=-.55;e.add(e.profile([[-2.62,-.3],[-2.64,.55],[1.55,.55],[2.35,.45],[2.5,.3],[2.52,-.28]],-.3,Mf(t,u,.1),1.98,.05),n),e.add(e.profile([[-2.62,.53],[-2.6,1.78],[-2.5,1.84],[1.1,1.84],[1.25,1.76],[1.6,.56]],.53,[],1.94,.06),n),e.span([1.58,.62],[1.2,1.6],1.74,a);let d=.974;e.sidePoly([[.62,.82],[1.42,.82],[1.2,1.55],[.62,1.55]],d,a),e.sidePoly([[-.9,.95],[.4,.95],[.4,1.55],[-.9,1.55]],d,a),e.sidePoly([[-2.45,.95],[-1.2,.95],[-1.2,1.55],[-2.45,1.55]],d,a);for(let t of[1.5,.52,-1.05])e.line([t,-.26],[t,1.6],.992);e.sym(()=>e.box(.02,.025,1.6),i,1.002,1.62,-.25,0,0,0,1),e.sym(()=>e.box(.012,.18,4.9),l,.998,.18,-.05,0,0,0,1),e.add(e.box(1.7,.05,.85,.02),n,0,.5,2,-.18,0,0),e.add(e.box(1.3,.3,.05,.03),r,0,.18,2.52);for(let t=0;t<3;t++)e.add(e.box(1.2,.03,.03),i,0,.08+t*.1,2.55,0,0,0,1);e.lampRect(.72,.24,2.52,.3,.14,o),e.lampRect(.9,.08,2.5,.12,.06,c),e.add(e.box(2.04,.24,.24,.04),i,0,-.18,2.58),Pf(e,.55,-.2,2.7);for(let t of[1,-1])e.lampRound(t*.35,1.92,1,.08,o);e.flare(t.wheel.zf,u,t.wheel.r+.1,1.06,.16,.12),e.flare(t.wheel.zr,u,t.wheel.r+.1,1.06,.16,.12),e.sym(()=>e.box(.2,.05,1.3),i,1.04,-.36,0),e.sym(()=>e.box(.34,.36,.015),r,.82,-.5,t.wheel.zr-.64,0,0,0,1),e.line([-2.645,-.28],[-2.645,1.75],0);for(let t of[1,-1])e.add(new Sa(.62,.45),a,t*.45,1.3,-2.645,0,Math.PI,0);Ff(e,.42,.26,.45,.4,-2.8);for(let t of[1,-1])e.add(e.box(.04,1.5,.04),i,-.45+t*.2,1,-2.7,0,0,0,1);for(let t=0;t<6;t++)e.add(e.cylX(.015,.4,6),i,-.45,.4+t*.25,-2.7,0,0,0,1);e.lampRect(.88,.45,-2.645,.12,.36,s,-1),e.add(e.box(2,.2,.2,.03),i,0,-.2,-2.7),If(e,1.8,1.9,-2.4,.8,8),e.add(e.box(.9,.06,.7),r,0,1.96,-1.6),e.mirrors(d,1.05,1.35,!0),Nf(e,t,-.38,-2.5,2.4)}function Xf(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,amber:c}=e.m,l=-.5,u=1.9;e.add(e.profile([[-2.05,-.28],[-2.05,.42],[-.9,.42],[-.9,.5],[1.05,.5],[2.1,.42],[2.15,-.22]],-.28,Mf(t,l,.12),u,.02),n),e.add(e.box(1.7,.04,2),r,0,.18,-.95);for(let t of[1,-1])e.add(e.box(.12,.3,2.9),n,t*(u/2-.06),.62,-.55,0,0,0,1);e.add(e.box(1.7,.05,.05),i,0,.55,1),e.add(e.box(1.7,.05,.05),i,0,1.22,.9);for(let t of[1,-1])e.add(e.box(.05,.7,.05),i,t*.84,.88,.95,-.15,0,0);e.add(new Sa(1.62,.62),a,0,.88,.95,-.15,0,0);for(let t of[-.35,-1.75]){for(let n of[1,-1])e.add(e.cyl(.04,.04,.9,10),i,n*.84,.95,t);e.add(e.cylX(.04,1.72,10),i,0,1.4,t)}for(let t of[1,-1])e.add(e.cylZ(.04,1.4,10),i,t*.84,1.4,-1.05);e.add(e.box(1.6,.04,1.05,.01),n,0,.53,1.58);for(let t=0;t<5;t++)e.add(e.box(.5,.012,.04),r,0,.555,1.3+t*.12,0,0,0,1);e.add(e.box(1.5,.42,.04),r,0,.22,2.12);for(let t=-4;t<=4;t++)e.add(e.box(.04,.32,.02),i,t*.12,.22,2.14,0,0,0,1);e.lampRound(.65,.3,2.15,.09,o),e.lampRound(.65,.1,2.15,.035,c),e.add(e.box(1.9,.14,.14),i,0,-.15,2.2);for(let t of[1,-1])e.add(e.cyl(.03,.03,.55,8),i,t*.5,.15,2.26);e.add(e.cylX(.03,1.1,8),i,0,.42,2.26),Pf(e,.45,-.15,2.3);for(let t of[1,-1])e.add(e.box(.5,.12,.5),r,t*.42,.35,-.2),e.add(e.box(.5,.55,.1),r,t*.42,.62,-.5,-.15,0,0);Ff(e,.42,.28,.3,.55,-2.2);for(let t of[-.35,-.75])e.add(e.box(.16,.42,.3,.02),n,t,.5,-2.2);e.lampRect(.8,.28,-2.06,.1,.12,s,-1),e.flare(t.wheel.zf,l,t.wheel.r+.12,1,.12,.1,.05,Math.PI-.05,n),e.flare(t.wheel.zr,l,t.wheel.r+.12,1,.12,.1,.05,Math.PI-.05,n),e.add(e.cyl(.05,.05,1,10),r,-1,.7,.9),qf(e,u/2,-2,2,-.15,.4,[4016682,5986874,2763298],16,.53,1.5),e.mirrors(.97,.85,.98),Nf(e,t,-.34,-1.9,2)}function Zf(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,amber:c}=e.m,l=-.55;e.add(e.profile([[-2.8,-.3],[-2.8,.7],[1.3,.7],[2.4,.55],[2.62,.3],[2.62,-.25]],-.3,Mf(t,l,.12),2.08,.03),n),e.add(e.profile([[-2.78,.68],[-2.7,1.62],[.75,1.62],[1.25,.72]],.68,[],1.9,.03),n),e.span([1.22,.86],[.85,1.45],1.3,a),e.add(e.box(1.5,.08,.1),r,0,.8,1.27,-.6,0,0,1);let u=.956;for(let t of[.4,-.6,-1.6])e.sidePoly([[t-.32,1.05],[t+.32,1.05],[t+.32,1.38],[t-.32,1.38]],u,a);for(let t of[1.25,-.1,-1.1])e.line([t,-.26],[t,1.55],1.042,.02);for(let t of[.9,-.2,-1.3,-2.3])e.sym(()=>e.box(.03,.55,.9,.01),i,1.057,.2,t,0,0,0,1);e.add(e.box(1.8,.05,1.1,.02),n,0,.62,1.95,-.14,0,0),e.add(e.box(1.6,.5,.06),r,0,.2,2.63);for(let t=0;t<6;t++)e.add(e.box(1.5,.03,.05),i,0,0+t*.08,2.66,.4,0,0,1);e.lampRect(.82,.3,2.64,.18,.12,o);for(let t of[1,-1])for(let n=0;n<3;n++)e.add(e.box(.02,.16,.02),i,t*.82+(n-1)*.06,.3,2.7,0,0,0,1);e.lampRect(.95,.12,2.63,.08,.05,c),e.add(e.box(2.1,.3,.3,.03),i,0,-.15,2.72),Pf(e,.6,-.15,2.88),e.add(e.cyl(.45,.45,.12,20),i,0,1.68,-.8),e.add(e.cyl(.38,.38,.14,20),r,0,1.69,-.8);for(let t of[1,-1])e.add(e.cyl(.04,.05,.1,8),r,t*.75,1.67,-2.3),e.add(e.cyl(.008,.008,1.4,4),r,t*.75,2.4,-2.3,0,0,0,1);If(e,1.7,1.66,-2.6,-1.4,5),e.add(new Sa(.4,.3),a,.4,1.2,-2.805,0,Math.PI,0),e.line([-2.805,-.25],[-2.805,1.5],0,.02),e.lampRect(.9,.5,-2.8,.12,.2,s,-1),e.add(e.box(1.6,.06,.3),i,0,-.3,-2.9),e.flare(t.wheel.zf,l,t.wheel.r+.12,1.07,.12,.14,.05,Math.PI-.05,n),e.flare(t.wheel.zr,l,t.wheel.r+.12,1.07,.12,.14,.05,Math.PI-.05,n),qf(e,1.072,-2.6,2.4,-.1,1.5,[11770731,9074e3,7035454],22,1.62,1.6),e.mirrors(u,1,1.15,!0),Nf(e,t,-.4,-2.6,2.5)}function Qf(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,amber:c,accent:l}=e.m,u=2.2;e.add(e.box(1,.25,8),i,0,-.05,-.45),e.add(e.profile([[.6,.1],[.6,1.95],[2,1.95],[2.1,1.85],[2.12,1],[2.15,.1]],.1,[],2,.04),n),e.add(new Sa(1.7,.6),a,0,1.5,2.125,0,0,0);for(let t of[1,-1])e.add(new Sa(.65,.55),a,t*1.005,1.5,1.55,0,t*Math.PI/2,0);e.sym(()=>e.box(.012,.03,1),r,1.005,.9,1.4,0,0,0,1),e.add(e.box(1.6,.9,1.3,.05),n,0,.75,2.8),e.add(e.box(1.4,.7,.05),r,0,.7,3.46);for(let t=-5;t<=5;t++)e.add(e.box(.04,.6,.03),i,t*.12,.7,3.48,0,0,0,1);for(let t of[1,-1])e.lampRound(t*.95,.75,3.3,.11,o),e.add(e.box(.5,.06,1.2),n,t*1,.95,2.8),e.add(e.box(.5,.6,.05),n,t*1,.65,3.38);e.lampRound(.95,.5,3.4,.04,c),e.add(e.box(2.3,.25,.25,.03),i,0,.1,3.55),Pf(e,.7,.1,3.7),e.add(e.box(u,.15,4.4),i,0,.35,-2);for(let t of[1,-1])e.add(e.box(.06,.5,4.4),n,t*(u/2-.03),.65,-2);e.add(e.box(u,.5,.06),n,0,.65,-4.2),e.add(e.box(u,.5,.06),n,0,.65,.2);let d=Kf(5921852);e.add(e.box(2.22,1.2,4.4,.08),d,0,1.5,-2);for(let t=0;t<6;t++)e.add(e.box(2.24,.03,.04),r,0,2.11,-0-t*.8,0,0,0,1);for(let t=0;t<8;t++)e.sym(()=>e.box(.03,.08,.03),r,1.12,.92,-.1-t*.55,0,0,0,1);e.add(e.cylZ(.25,.9,14),i,-.85,0,.9),e.add(e.box(.3,.05,.4),i,.95,-.15,1.2),Ff(e,t.wheel.r,t.wheel.w,0,.45,.45),e.lampRect(.9,.3,-4.25,.14,.12,s,-1);for(let n of[t.wheel.zr,t.wheel.zr-1.4])e.sym(()=>e.box(.5,.04,1.3),r,u/2-.15,t.wheel.y+t.wheel.r+.12,n,0,0,0,1);e.sym(()=>e.box(.5,.04,1.2),n,u/2-.1,t.wheel.y+t.wheel.r+.15,t.wheel.zf,0,0,0,1),Jf(e,t,t.wheel.zr-1.4,t.wheel.y-t.susp.rest+.05),qf(e,1.03,.7,2,.2,1,[4016682,2763298],6),e.add(e.box(.012,.012,.012),l,0,-10,0,0,0,0,1),e.mirrors(1.02,1.6,2,!0)}function $f(e,t){let{paint:n,dark:r,steel:i,glass:a,lamp:o,tail:s,amber:c}=e.m,l=2.3;for(let t of[1,-1])e.add(e.box(1.2,.08,5.4),i,t*.5,-.05,-.2,0,0,t*.5);e.add(e.profile([[-3,.2],[-3,1.2],[1.6,1.2],[2.9,.95],[3,.4],[3,.2]],.2,[],l,.04),n),e.add(e.profile([[-2.98,1.18],[-2.95,2.25],[1,2.25],[1.55,1.2]],1.18,[],2.1,.05),n),e.span([1.5,1.35],[1.1,2.05],1.5,a),e.add(e.box(1.8,.12,.14),r,0,1.3,1.55,-.9,0,0,1);let u=1.056;for(let t of[.6,-.5,-1.6])e.sidePoly([[t-.25,1.6],[t+.25,1.6],[t+.25,1.95],[t-.25,1.95]],u,a);for(let t of[1.1,-.05,-1.05])e.line([t,.25],[t,2.15],1.154,.025);for(let t of[.6,-1,-2.4])e.sym(()=>e.box(.04,.8,1.3,.01),i,1.174,.75,t,0,0,0,1);e.add(e.box(2,.06,1.4,.02),n,0,1.08,2.25,-.2,0,0),e.add(e.box(1.9,.6,.06),r,0,.65,3);for(let t=0;t<6;t++)e.add(e.box(1.8,.04,.06),i,0,.42+t*.09,3.03,.4,0,0,1);e.lampRect(.92,.82,3,.22,.14,o),e.lampRect(.92,.6,3,.1,.06,c),e.add(e.box(2.4,.35,.35,.03),i,0,.12,3.12),Pf(e,.75,.1,3.3),e.add(e.cyl(.5,.5,.14,20),i,0,2.32,-.6),e.add(e.cyl(.42,.42,.16,20),r,0,2.33,-.6);for(let t of[1,-1])e.add(e.cyl(.01,.01,1.6,4),r,t*.9,3.05,-2.6,0,0,0,1);If(e,1.8,2.28,-2.8,-1.6,5),e.add(e.box(1.4,1.6,.08),i,0,1.15,-3.02),e.add(new Sa(.3,.25),a,0,1.6,-3.07,0,Math.PI,0),e.lampRect(1,1,-3,.12,.2,s,-1);for(let t=0;t<3;t++)e.add(e.box(.8,.04,.2),i,0,.1-t*.2,-3.15,0,0,0,1);for(let r of[t.wheel.zf,t.wheel.zr])e.sym(()=>e.box(.6,.06,1.6),n,l/2-.1,t.wheel.y+t.wheel.r+.18,r,0,0,0,1);qf(e,1.194,-2.9,2.6,.4,2.1,[11770731,9074e3,7035454],26,2.25,1.8),e.mirrors(u,1.6,1.5,!0)}var ep={scout:zf,f110:Rf,voyager:Bf,sahara:Vf,pickup:Hf,rally:Uf,recovery:Wf,van:Yf,ltv:Xf,patrol:Zf,cargo6:Qf,mrap:$f},tp=[{id:`suv`,label:`SUVs`},{id:`pickup`,label:`Pickups`},{id:`rally`,label:`Rally`},{id:`recovery`,label:`Recovery`},{id:`van`,label:`Vans`},{id:`military`,label:`Military`}],np=[{drive:[`2H`,`4H`,`4L`],id:`scout`,cat:`suv`,name:`Frontier Scout`,klass:`Short-wheelbase classic 4×4`,defaultPaint:12091962,desc:`Boxy, nimble and tough. Short overhangs and long-travel springs make it the all-round trail tool.`,mass:1650,inertia:[4200,4800,1300],com:[0,-.35,.05],chassis:{hx:.95,hy:.42,hz:2.25,y:.1},cabin:{hx:.85,hy:.35,hz:1.2,y:.85,z:-.3},wheel:{x:.98,y:-.25,zf:1.42,zr:-1.42,r:.43,w:.34},susp:{rest:.38,travel:.32,stiffness:28,compression:2.6,relaxation:3.2},engine:4600,topSpeed:36,reverse:9,grip:{ground:1,sand:1,mud:1},side:1,drag:{sand:1,mud:1},steerLow:.6,steerHigh:.26,assist:3,lamp:{x:.7,y:.35,z:2.3},rim:{style:`steel`,color:14277076,metal:.3,rough:.5},axle:`solid`,spring:13149184,build:ep.scout},{drive:[`2H`,`4H`,`4L`],id:`f110`,cat:`suv`,name:`Frontier 110`,klass:`Modern boxy expedition SUV`,defaultPaint:7039564,accent:1118740,desc:`Upright 4-door expedition wagon: black roof, roof rack and long-travel suspension. Heavy and tall: roll it into corners and let the springs work.`,mass:2300,inertia:[5600,6300,1800],com:[0,-.2,.05],chassis:{hx:1,hy:.45,hz:2.3,y:.1},cabin:{hx:.95,hy:.32,hz:1.55,y:.95,z:-.6},wheel:{x:1,y:-.3,zf:1.5,zr:-1.52,r:.45,w:.32},susp:{rest:.44,travel:.4,stiffness:24,compression:2.3,relaxation:2.9},engine:5400,topSpeed:42,reverse:9,grip:{ground:.95,sand:1.05,mud:1.05},side:.95,drag:{sand:.95,mud:.95},steerLow:.56,steerHigh:.24,assist:2.6,lamp:{x:.72,y:.42,z:2.32},rim:{style:`rally`,color:2763565,metal:.6,rough:.35},axle:`independent`,spring:2763306,build:ep.f110},{drive:[`2H`,`4H`,`4L`],id:`voyager`,cat:`suv`,name:`Voyager Expedition`,klass:`Large expedition SUV`,defaultPaint:5201210,desc:`Long-range overlander with a roof tent, winch bar and plush long-travel suspension. Comfortable, heavy, unstoppable.`,mass:2450,com:[0,-.4,.1],chassis:{hx:1,hy:.45,hz:2.45,y:.1},cabin:{hx:.95,hy:.4,hz:1.6,y:.95,z:-.4},wheel:{x:1.02,y:-.3,zf:1.5,zr:-1.45,r:.44,w:.34},susp:{rest:.42,travel:.36,stiffness:25,compression:2.4,relaxation:3},engine:5600,topSpeed:40,reverse:9,grip:{ground:.85,sand:1.05,mud:1.15},side:.95,drag:{sand:.95,mud:.85},steerLow:.55,steerHigh:.23,assist:2.4,lamp:{x:.72,y:.38,z:2.5},rim:{style:`spoke`,color:2763822,metal:.5,rough:.45},axle:`solid`,spring:2056127,build:ep.voyager},{drive:[`2H`,`4H`,`4L`],id:`sahara`,cat:`suv`,name:`Sahara GT`,klass:`Full-size desert SUV`,defaultPaint:15132384,desc:`Big-bore V8 dune cruiser. Huge power and wide sand-biting tyres; long and heavy in the tight stuff.`,mass:2700,com:[0,-.38,.15],chassis:{hx:1.03,hy:.45,hz:2.55,y:.1},cabin:{hx:.97,hy:.4,hz:1.5,y:.95,z:-.35},wheel:{x:1.05,y:-.3,zf:1.55,zr:-1.55,r:.46,w:.38},susp:{rest:.4,travel:.3,stiffness:32,compression:2.8,relaxation:3.4},engine:7400,topSpeed:44,reverse:10,grip:{ground:.9,sand:1.25,mud:.95},side:1,drag:{sand:.8,mud:1.05},steerLow:.52,steerHigh:.22,assist:2.4,lamp:{x:.74,y:.4,z:2.58},rim:{style:`twin`,color:13225169,metal:.9,rough:.25},axle:`independent`,spring:10132122,build:ep.sahara},{drive:[`2H`,`4H`,`4L`],id:`pickup`,cat:`pickup`,name:`Workhorse Trail`,klass:`Off-road pickup`,defaultPaint:11740702,desc:`Double-cab trail truck with a cargo bed and roll bar. Long wheelbase: stable at speed, wide in the turns.`,mass:2200,com:[0,-.38,.35],chassis:{hx:.98,hy:.42,hz:2.7,y:.1},cabin:{hx:.93,hy:.4,hz:.95,y:.92,z:.45},wheel:{x:1,y:-.3,zf:1.75,zr:-1.65,r:.44,w:.34},susp:{rest:.4,travel:.34,stiffness:27,compression:2.6,relaxation:3.2},engine:4800,topSpeed:38,reverse:9,grip:{ground:.88,sand:1.05,mud:1},side:1,drag:{sand:1,mud:1},steerLow:.5,steerHigh:.22,assist:2.4,lamp:{x:.72,y:.38,z:2.72},rim:{style:`spoke`,color:10330792,metal:.8,rough:.35},axle:`solid`,spring:13777694,build:ep.pickup},{drive:[`AWD`],frontSplit:.4,id:`rally`,cat:`rally`,name:`Apex R4`,klass:`Rally car`,defaultPaint:2907535,desc:`Featherweight turbo rally hatch. Explosive acceleration and sharp turn-in; low ground clearance hates deep mud.`,mass:1250,com:[0,-.3,.1],chassis:{hx:.9,hy:.35,hz:2.05,y:.05},cabin:{hx:.78,hy:.3,hz:1,y:.62,z:-.3},wheel:{x:.9,y:-.15,zf:1.3,zr:-1.25,r:.36,w:.3},susp:{rest:.3,travel:.22,stiffness:42,compression:3.2,relaxation:3.8},engine:4400,topSpeed:48,reverse:10,grip:{ground:1.15,sand:.9,mud:.78},side:1.2,drag:{sand:1.15,mud:1.55},steerLow:.65,steerHigh:.32,assist:4,lamp:{x:.62,y:.2,z:2.08},rim:{style:`rally`,color:15921904,metal:.2,rough:.4},axle:`independent`,spring:15254016,build:ep.rally},{drive:[`4H`,`4L`],id:`recovery`,cat:`recovery`,name:`Atlas Recovery`,klass:`Recovery truck`,defaultPaint:14711327,desc:`Cab-over 4×4 recovery rig with a hydraulic boom and front winch. Massive torque and tyres, slow and heavy.`,mass:4300,com:[0,-.5,.4],chassis:{hx:1.15,hy:.55,hz:3.5,y:.3},cabin:{hx:1.12,hy:.7,hz:.9,y:1.45,z:2.45},wheel:{x:1.1,y:-.12,zf:2.4,zr:-2,r:.55,w:.42},susp:{rest:.44,travel:.34,stiffness:30,compression:2.8,relaxation:3.4},engine:8200,topSpeed:29,reverse:7,grip:{ground:.72,sand:1.05,mud:1.25},side:.95,drag:{sand:.9,mud:.75},steerLow:.48,steerHigh:.2,assist:1.6,lamp:{x:.85,y:.65,z:3.4},rim:{style:`truck`,color:12106944,metal:.5,rough:.45},axle:`solid`,spring:3355443,build:ep.recovery},{drive:[`2H`,`4H`,`4L`],id:`van`,cat:`van`,name:`Nomad 4×4 Van`,klass:`Off-road expedition van`,defaultPaint:9214602,desc:`Tall lifted camper van with a roof rack, ladder and light pods. Roomy and stable, but top-heavy: brake before corners.`,mass:2900,com:[0,-.25,.1],chassis:{hx:1,hy:.45,hz:2.6,y:.1},cabin:{hx:.96,hy:.6,hz:1.55,y:1.1,z:0},wheel:{x:1.02,y:-.28,zf:1.68,zr:-1.6,r:.44,w:.32},susp:{rest:.42,travel:.32,stiffness:27,compression:2.6,relaxation:3.1},engine:5600,topSpeed:36,reverse:8,grip:{ground:.9,sand:.95,mud:1},side:.9,drag:{sand:1.05,mud:1},steerLow:.52,steerHigh:.2,assist:2,lamp:{x:.72,y:.24,z:2.5},rim:{style:`steel`,color:2763822,metal:.3,rough:.5},axle:`solid`,spring:14196768,build:ep.van},{drive:[`2H`,`4H`,`4L`],id:`ltv`,cat:`military`,name:`Ranger LTV`,klass:`Light tactical 4×4 (military)`,defaultPaint:4936480,desc:`Open-top light utility 4×4 in olive drab camo. Light, short and agile with big articulation. No weapons, no markings.`,mass:1500,com:[0,-.4,.05],chassis:{hx:.95,hy:.38,hz:2.1,y:.05},cabin:{hx:.86,hy:.3,hz:1.2,y:.6,z:-.25},wheel:{x:1,y:-.25,zf:1.4,zr:-1.35,r:.45,w:.34},susp:{rest:.4,travel:.36,stiffness:26,compression:2.5,relaxation:3},engine:4600,topSpeed:35,reverse:9,grip:{ground:1,sand:1.05,mud:1.1},side:1.05,drag:{sand:.95,mud:.9},steerLow:.62,steerHigh:.27,assist:3.2,lamp:{x:.65,y:.3,z:2.18},rim:{style:`steel`,color:4016682,metal:.2,rough:.6},axle:`solid`,spring:2763298,build:ep.ltv},{drive:[`4H`,`4L`],id:`patrol`,cat:`military`,name:`Bastion APT`,klass:`Armored patrol truck (military)`,defaultPaint:12757112,desc:`Armored patrol truck in sand camo: heavy plating, run-flat tyres and torque to spare. Slower to turn and stop.`,mass:3800,com:[0,-.35,.15],chassis:{hx:1.05,hy:.5,hz:2.75,y:.15},cabin:{hx:.95,hy:.48,hz:1.4,y:1.15,z:-.15},wheel:{x:1.06,y:-.25,zf:1.75,zr:-1.75,r:.5,w:.38},susp:{rest:.42,travel:.32,stiffness:31,compression:2.9,relaxation:3.4},engine:7400,topSpeed:33,reverse:8,grip:{ground:.85,sand:1.05,mud:1.1},side:.95,drag:{sand:.9,mud:.85},steerLow:.5,steerHigh:.2,assist:1.9,lamp:{x:.82,y:.3,z:2.65},rim:{style:`truck`,color:7035454,metal:.3,rough:.6},axle:`solid`,spring:3355443,build:ep.patrol},{drive:[`4H`,`4L`],id:`cargo6`,cat:`military`,name:`Mule 6×6 Cargo`,klass:`6×6 cargo truck (military)`,defaultPaint:4936480,desc:`Long bonneted 6×6 with a canvas-covered bed. Huge traction in mud, slow and wide-turning. (Third axle is visual in this build.)`,mass:5200,com:[0,-.3,.3],chassis:{hx:1.1,hy:.5,hz:3.9,y:.4},cabin:{hx:.98,hy:.6,hz:.75,y:1.4,z:1.35},wheel:{x:1.05,y:-.1,zf:2.6,zr:-1.7,r:.56,w:.4},susp:{rest:.46,travel:.32,stiffness:32,compression:3,relaxation:3.5},engine:9e3,topSpeed:27,reverse:6,grip:{ground:.8,sand:1.1,mud:1.3},side:.95,drag:{sand:.85,mud:.7},steerLow:.46,steerHigh:.18,assist:1.5,lamp:{x:.95,y:.75,z:3.35},rim:{style:`truck`,color:4016682,metal:.3,rough:.6},axle:`solid`,spring:2763298,build:ep.cargo6},{drive:[`4H`,`4L`],id:`mrap`,cat:`military`,name:`Warden MRAP`,klass:`MRAP-style armored vehicle (military)`,defaultPaint:12757112,desc:`Tall V-hull armored vehicle in sand camo. Very heavy and high: unstoppable over rocks, but watch the roll in fast turns. No weapons.`,mass:6500,com:[0,-.15,.2],chassis:{hx:1.15,hy:.6,hz:3,y:.6},cabin:{hx:1.05,hy:.6,hz:1.45,y:1.7,z:.05},wheel:{x:1.12,y:.05,zf:1.95,zr:-1.85,r:.62,w:.44},susp:{rest:.48,travel:.34,stiffness:34,compression:3.1,relaxation:3.6},engine:10500,topSpeed:29,reverse:6,grip:{ground:.8,sand:1,mud:1.15},side:.9,drag:{sand:.9,mud:.8},steerLow:.45,steerHigh:.17,assist:1.4,lamp:{x:.92,y:.82,z:3.05},rim:{style:`truck`,color:7035454,metal:.3,rough:.6},axle:`solid`,spring:3355443,build:ep.mrap}],rp=e=>np.find(t=>t.id===e)??np[0],ip=[{name:`Desert Tan`,hex:12091962},{name:`Expedition Green`,hex:5201210},{name:`Glacier White`,hex:15132384},{name:`Rescue Red`,hex:11740702},{name:`Ocean Blue`,hex:2907535},{name:`Graphite`,hex:3816770},{name:`Sunburst Orange`,hex:14711327},{name:`Sand Beige`,hex:14206106},{name:`Satin Olive Khaki`,hex:7039564},{name:`Expedition Silver`,hex:11843772},{name:`Basalt Grey`,hex:5593438},{name:`Night Black`,hex:1579291},{name:`Fuji White`,hex:15658730}];function ap(e){let t=e.engine*4/e.mass;return{Power:Math.min(1,t/14.5),"Top speed":Math.min(1,e.topSpeed/50),Handling:Math.min(1,e.steerHigh/.32*.6+e.side*.35-(e.wheel.zf-e.wheel.zr)*.05),"Off-road":Math.min(1,(e.grip.mud+e.grip.sand)/2/((e.drag.mud+e.drag.sand)/2)*.55+e.susp.travel/.36*.35),Weight:Math.min(1,e.mass/4500)}}var op={gas0:.3,gasRamp:.5,brake0:.4,brakeRamp:.25},sp={up:`Accelerate`,down:`Brake / reverse`,left:`Steer left`,right:`Steer right`,hand:`Handbrake`,camera:`Next camera`,reset:`Reset vehicle`,lookback:`Look back (hold)`,camreset:`Reset camera`,pause:`Pause`},cp={up:[`KeyW`,`ArrowUp`],down:[`KeyS`,`ArrowDown`],left:[`KeyA`,`ArrowLeft`],right:[`KeyD`,`ArrowRight`],hand:[`Space`],camera:[`KeyC`],reset:[`KeyR`],lookback:[`KeyB`],camreset:[`KeyV`],pause:[`Escape`,`KeyP`]},lp=`owf.bindings.v1`,up={A:0,B:1,X:2,Y:3,LB:4,RB:5,LT:6,RT:7,BACK:8,START:9,UP:12,DOWN:13,LEFT:14,RIGHT:15},dp=class e{static loadBindings(){try{return{...cp,...JSON.parse(localStorage.getItem(lp)||`{}`)}}catch{return{...cp}}}setBinding(e,t){this.bindings[e]=t;try{localStorage.setItem(lp,JSON.stringify(this.bindings))}catch{}}resetBindings(){this.bindings={...cp};try{localStorage.removeItem(lp)}catch{}}isBound(e,t){return this.bindings[e].includes(t)}constructor(){Q(this,`keys`,new Set),Q(this,`touch`,{left:!1,right:!1,gas:!1,brake:!1,hand:!1}),Q(this,`split`,!1),Q(this,`p2touch`,{left:!1,right:!1,gas:!1,brake:!1,hand:!1}),Q(this,`p2Steer`,0),Q(this,`p2Gas`,0),Q(this,`p2Brake`,0),Q(this,`p2wheel`,{wheelDeg:0,wheelHeld:!1,wheelLock:450,wheelSens:1}),Q(this,`onWheel2`,()=>{}),Q(this,`override2`,null),Q(this,`zones`,new Map),Q(this,`steerSmooth`,0),Q(this,`gasV`,0),Q(this,`brakeV`,0),Q(this,`wheelDeg`,0),Q(this,`wheelLock`,450),Q(this,`wheelSens`,1),Q(this,`wheelHeld`,!1),Q(this,`onWheel`,()=>{}),Q(this,`override`,null),Q(this,`onPause`,()=>{}),Q(this,`onReset`,()=>{}),Q(this,`onKey`,()=>!1),Q(this,`bindings`,e.loadBindings()),Q(this,`capture`,null),Q(this,`lastDevice`,`keys`),Q(this,`padDeadzone`,.12),Q(this,`padSens`,1),Q(this,`padIndex`,-1),Q(this,`padName`,``),Q(this,`padPrev`,[]),Q(this,`padNow`,[]),Q(this,`padAxes`,[]),Q(this,`padVals`,[]),Q(this,`onPadAction`,()=>{}),Q(this,`scheme`,`halves`),Q(this,`autoThrottle`,!1),Q(this,`touchActive`,!1),Q(this,`tiltState`,`off`),Q(this,`tiltRange`,24),Q(this,`tiltRaw`,null),Q(this,`tiltZero`,0),Q(this,`tiltEvents`,0),Q(this,`onTiltData`,()=>{}),Q(this,`onOrient`,e=>{if(e.beta===null||e.gamma===null)return;this.tiltEvents++===0&&this.onTiltData(),this.scheme===`tilt`&&this.lastDevice!==`touch`&&this.tiltRaw!==null&&Math.abs(this.tiltValue)>.15&&(this.lastDevice=`touch`),(this.tiltState===`no-data`||this.tiltState===`pending`)&&(this.tiltState=`granted`);let t=((screen.orientation?.angle??window.orientation??0)%360+360)%360;this.tiltRaw=t===90?-e.beta:t===270?e.beta:t===180?e.gamma:-e.gamma}),Q(this,`releasers`,[]),Q(this,`padAt`,-1e9),Q(this,`padOn`,!1),window.addEventListener(`keydown`,e=>{if(this.capture){e.preventDefault();let t=this.capture;this.capture=null,t(e.code)}else this.lastDevice=`keys`,!e.repeat&&this.onKey(e.code)?e.preventDefault():this.isBound(`pause`,e.code)?this.onPause():(this.isBound(`reset`,e.code)&&!e.repeat&&this.onReset(),[`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Space`].includes(e.code)&&e.preventDefault(),this.keys.add(e.code))}),window.addEventListener(`keyup`,e=>this.keys.delete(e.code)),window.addEventListener(`blur`,()=>{this.keys.clear(),this.clearTouch()}),document.addEventListener(`visibilitychange`,()=>{document.hidden&&(this.keys.clear(),this.clearTouch())})}clearTouch(){for(let e of this.releasers)e();for(let e of Object.keys(this.touch))this.touch[e]=!1,this.p2touch[e]=!1;this.zones.clear()}bindHold(e,t,n=this.touch){let r=new Set,i=()=>{n[t]=r.size>0,e.classList.toggle(`active`,r.size>0),r.size&&(this.lastDevice=`touch`)};this.releasers.push(()=>{r.clear(),i()});let a={passive:!1};e.addEventListener(`touchstart`,e=>{e.preventDefault(),e.stopPropagation();for(let t of e.changedTouches)r.add(`t`+t.identifier);i()},a);let o=e=>{e.preventDefault();for(let t of e.changedTouches)r.delete(`t`+t.identifier);e.targetTouches.length===0&&r.clear(),i()};e.addEventListener(`touchend`,o,a),e.addEventListener(`touchcancel`,o,a),e.addEventListener(`touchmove`,e=>e.preventDefault(),a),e.addEventListener(`pointerdown`,t=>{t.preventDefault(),t.stopPropagation(),r.add(`p`+t.pointerId);try{e.setPointerCapture(t.pointerId)}catch{}i()});let s=e=>{r.delete(`p`+e.pointerId),i()};e.addEventListener(`pointerup`,s),e.addEventListener(`pointercancel`,s),e.addEventListener(`lostpointercapture`,s),e.addEventListener(`contextmenu`,e=>e.preventDefault())}bindZones(e,t){let n=()=>{let e=[...this.zones.values()];e.length&&(this.lastDevice=`touch`),t(e.includes(`L`),e.includes(`R`))},r=t=>{let n=e.getBoundingClientRect();return t-n.left<n.width/2?`L`:`R`},i={passive:!1};e.addEventListener(`touchstart`,e=>{if(!e.target.closest(`button`)){e.preventDefault();for(let t of e.changedTouches)this.zones.set(`t`+t.identifier,r(t.clientX));n()}},i);let a=e=>{for(let t of e.changedTouches)this.zones.delete(`t`+t.identifier);if(e.targetTouches.length===0)for(let e of[...this.zones.keys()])e[0]===`p`&&this.zones.delete(e);n()};e.addEventListener(`touchend`,a,i),e.addEventListener(`touchcancel`,a,i),e.addEventListener(`touchmove`,e=>e.preventDefault(),i),e.addEventListener(`pointerdown`,t=>{if(!t.target.closest(`button`)){t.preventDefault(),this.zones.set(`p`+t.pointerId,r(t.clientX));try{e.setPointerCapture(t.pointerId)}catch{}n()}});let o=e=>{this.zones.delete(`p`+e.pointerId)&&n()};for(let t of[`pointerup`,`pointercancel`,`lostpointercapture`])e.addEventListener(t,o);e.addEventListener(`contextmenu`,e=>e.preventDefault())}bindWheel(e,t=this,n=e=>this.onWheel(e)){let r=null,i=null,a=0,o=(t,n)=>{let r=e.getBoundingClientRect();return Math.atan2(n-(r.top+r.height/2),t-(r.left+r.width/2))*180/Math.PI},s=(n,r)=>{a=o(n,r),t.wheelHeld=!0,e.classList.add(`active`),this.lastDevice=`touch`},c=(r,i)=>{let s=e.getBoundingClientRect(),c=r-(s.left+s.width/2),l=i-(s.top+s.height/2);if(c*c+l*l<(s.width*.08)**2)return;let u=o(r,i),d=u-a;d=(d+540)%360-180,a=u;let f=t.wheelLock/t.wheelSens;t.wheelDeg=Math.max(-f,Math.min(f,t.wheelDeg+d)),n(t.wheelDeg)},l=()=>{t.wheelHeld=!1,e.classList.remove(`active`)};this.releasers.push(()=>{r=null,i=null,l()});let u={passive:!1};e.addEventListener(`touchstart`,e=>{if(e.preventDefault(),e.stopPropagation(),r!==null)return;let t=e.changedTouches[0];r=t.identifier,s(t.clientX,t.clientY)},u),e.addEventListener(`touchmove`,e=>{e.preventDefault();for(let t of e.changedTouches)t.identifier===r&&c(t.clientX,t.clientY)},u);let d=e=>{e.preventDefault();for(let t of e.changedTouches)t.identifier===r&&(r=null,l());e.targetTouches.length===0&&r!==null&&![...e.touches].some(e=>e.identifier===r)&&(r=null,l())};e.addEventListener(`touchend`,d,u),e.addEventListener(`touchcancel`,d,u),e.addEventListener(`pointerdown`,t=>{if(t.pointerType!==`touch`&&(t.preventDefault(),t.stopPropagation(),i===null)){i=t.pointerId,s(t.clientX,t.clientY);try{e.setPointerCapture(t.pointerId)}catch{}}}),e.addEventListener(`pointermove`,e=>{e.pointerId===i&&c(e.clientX,e.clientY)});let f=e=>{e.pointerId===i&&(i=null,l())};for(let t of[`pointerup`,`pointercancel`,`lostpointercapture`])e.addEventListener(t,f);e.addEventListener(`contextmenu`,e=>e.preventDefault())}static wheelOut(e){let t=-e.wheelDeg/(e.wheelLock/e.wheelSens),n=.03;return Math.abs(t)<n?0:Math.max(-1,Math.min(1,(t-Math.sign(t)*n)/.97))}get wheelValue(){return e.wheelOut(this)}static recentre(e,t,n){if(e.wheelHeld||e.wheelDeg===0)return;let r=Math.max(240*t,Math.abs(e.wheelDeg)*7*t);e.wheelDeg=Math.abs(e.wheelDeg)<=r?0:e.wheelDeg-Math.sign(e.wheelDeg)*r,n(e.wheelDeg)}requestTilt(){let e=window.DeviceOrientationEvent;if(!e)return this.tiltState=`unsupported`,Promise.resolve(this.tiltState);let t=()=>{window.removeEventListener(`deviceorientation`,this.onOrient),window.addEventListener(`deviceorientation`,this.onOrient)};return typeof e.requestPermission==`function`?(this.tiltState=`pending`,e.requestPermission().then(e=>(e===`granted`?(t(),this.tiltState=this.tiltEvents?`granted`:`no-data`):this.tiltState=`denied`,this.tiltState)).catch(()=>this.tiltState=`denied`)):(t(),this.tiltState!==`granted`&&(this.tiltState=this.tiltEvents?`granted`:`no-data`),Promise.resolve(this.tiltState))}calibrateTilt(){this.tiltRaw!==null&&(this.tiltZero=this.tiltRaw)}get tiltValue(){if(this.tiltRaw===null)return 0;let e=this.tiltRaw-this.tiltZero;e=((e+180)%360+360)%360-180;let t=2.5;return Math.abs(e)<t?0:Math.max(-1,Math.min(1,(e-Math.sign(e)*t)/(this.tiltRange-t)))}pollPad(){let e=performance.now();return e-this.padAt<4||(this.padAt=e,this.padOn=this.pollPadNow()),this.padOn}pollPadNow(){let e=navigator.getGamepads?.()??[],t=null;for(let n of e)if(n&&n.connected&&(n.mapping===`standard`||!t)&&(t=n,n.mapping===`standard`))break;if(!t)return this.padIndex=-1,this.padName=``,!1;this.padIndex=t.index,this.padName=t.id,this.padPrev=this.padNow,this.padNow=t.buttons.map(e=>e.pressed||e.value>.5),this.padVals=t.buttons.map(e=>e.value);let n=this.padAxes;this.padAxes=t.axes.slice();let r=this.padDeadzone;return(this.padNow.some((e,t)=>e!==!!this.padPrev[t])||this.padAxes.some((e,t)=>Math.abs(e-(n[t]??0))>.2&&Math.abs(e)>r))&&(this.lastDevice=`pad`),!0}padPressed(e){return!!this.padNow[e]&&!this.padPrev[e]}padHeld(e){return!!this.padNow[e]}padAxis(e){let t=this.padAxes[e]??0,n=this.padDeadzone;return Math.abs(t)<n?0:Math.sign(t)*Math.min(1,(Math.abs(t)-n)/(1-n)*this.padSens)}rumble(e,t=120){if(this.padIndex<0)return;let n=navigator.getGamepads?.()[this.padIndex];try{n?.vibrationActuator?.playEffect?.(`dual-rumble`,{duration:t,strongMagnitude:Math.min(1,e),weakMagnitude:Math.min(1,e*.6)})}catch{}}held(e,t){return this.bindings[e].some(e=>this.keys.has(e)&&!(t&&e.startsWith(`Arrow`)))}read(t){if(this.override)return this.override;let n=this.touch;if(this.pollPad())for(let[e,t]of[[up.Y,`camera`],[up.X,`reset`],[up.BACK,`camreset`],[up.START,`pause`]])this.padPressed(e)&&this.onPadAction(t);let r=[...this.zones.values()],i=r.includes(`L`),a=r.includes(`R`),o=this.split,s=[`up`,`down`,`left`,`right`,`hand`].some(e=>this.held(e,o)),c=this.lastDevice===`keys`&&!s&&this.touchActive?`touch`:this.lastDevice,l=0,u=0,d=!1,f=!1,p=null,m=!1;if(e.recentre(this,t,e=>this.onWheel(e)),this.gasV=this.touchActive&&n.gas?Math.min(1,Math.max(op.gas0,this.gasV+t/op.gasRamp)):0,this.brakeV=this.touchActive&&n.brake?Math.min(1,Math.max(op.brake0,this.brakeV+t/op.brakeRamp)):0,c===`pad`&&this.padIndex>=0)p=-this.padAxis(0),l=Math.max(this.padVals[up.RT]??0,+(this.padAxis(1)<-.5)),u=Math.max(this.padVals[up.LT]??0,+(this.padAxis(1)>.5)),l<.05&&(l=0),u<.05&&(u=0),m=this.padHeld(up.A),this.padHeld(up.LEFT)&&(p=null,d=!0),this.padHeld(up.RIGHT)&&(p=null,f=!0);else if(c===`touch`&&this.touchActive){if(m=n.hand,this.scheme!==`halves`&&(l=this.gasV,u=this.brakeV),this.scheme===`halves`){let e=i&&a;d=i&&!a,f=a&&!i,(e||n.brake)&&(u=1),u===0&&(l=1)}else this.scheme===`wheel`?p=this.wheelValue:this.scheme===`buttons`?(d=n.left,f=n.right):(p=this.tiltValue,a&&(l=Math.max(l,1)),i&&(u=Math.max(u,1)),this.autoThrottle&&u===0&&(l=Math.max(l,1)))}else l=+!!this.held(`up`,o),u=+!!this.held(`down`,o),d=this.held(`left`,o),f=this.held(`right`,o),m=this.held(`hand`,!1),this.touchActive&&this.scheme===`wheel`&&this.wheelDeg!==0&&(p=this.wheelValue);u>.05&&(l=0);let h=p??!!d-+!!f,g=p===null?h===0?6:3.5:10;return this.steerSmooth+=Math.max(-g*t,Math.min(g*t,h-this.steerSmooth)),{throttle:l,brake:u,steer:this.steerSmooth,handbrake:m}}readP2(t){if(this.override2)return this.override2;let n=this.keys,r=this.p2touch;this.p2Gas=r.gas?Math.min(1,Math.max(op.gas0,this.p2Gas+t/op.gasRamp)):0,this.p2Brake=r.brake?Math.min(1,Math.max(op.brake0,this.p2Brake+t/op.brakeRamp)):0;let i=Math.max(+!!n.has(`ArrowUp`),this.p2Gas),a=Math.max(+!!n.has(`ArrowDown`),this.p2Brake);a>.05&&(i=0),e.recentre(this.p2wheel,t,e=>this.onWheel2(e));let o=(n.has(`ArrowLeft`)||r.left?1:0)-(n.has(`ArrowRight`)||r.right?1:0),s=o===0&&this.touchActive,c=s?e.wheelOut(this.p2wheel):o,l=s?10:c===0?6:3.5;return this.p2Steer+=Math.max(-l*t,Math.min(l*t,c-this.p2Steer)),{throttle:i,brake:a,steer:this.p2Steer,handbrake:n.has(`ShiftRight`)||n.has(`Enter`)||n.has(`NumpadEnter`)||r.hand}}},fp=class{constructor(){Q(this,`ctx`,null),Q(this,`master`,void 0),Q(this,`engineGain`,void 0),Q(this,`oscA`,void 0),Q(this,`oscB`,void 0),Q(this,`engineFilter`,void 0),Q(this,`analyser`,void 0),Q(this,`noise`,void 0),Q(this,`wind`,void 0),Q(this,`windF`,void 0),Q(this,`rain`,void 0),Q(this,`rockG`,void 0),Q(this,`rockF`,void 0),Q(this,`nextCrunch`,0),Q(this,`rockLevel`,0),Q(this,`dirt`,void 0),Q(this,`sandG`,void 0),Q(this,`mudG`,void 0),Q(this,`mudF`,void 0),Q(this,`nextChirp`,0),Q(this,`nextSquelch`,0),Q(this,`volume`,.8),Q(this,`muted`,!1),Q(this,`engineHz`,0),Q(this,`suspendedByPage`,!1),Q(this,`impacts`,0);let e=()=>{if(this.unlock(),this.ctx&&this.ctx.state===`running`)for(let t of[`pointerdown`,`pointerup`,`touchend`,`keydown`,`click`])window.removeEventListener(t,e,!0)};for(let t of[`pointerdown`,`pointerup`,`touchend`,`keydown`,`click`])window.addEventListener(t,e,!0);document.addEventListener(`visibilitychange`,()=>{this.ctx&&(document.hidden?(this.suspendedByPage=!0,this.ctx.suspend()):this.suspendedByPage&&(this.suspendedByPage=!1,this.ctx.resume()))})}get state(){return this.ctx?this.ctx.state:`none`}unlock(){if(!this.ctx){let e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.build()}let e=this.ctx;e.state!==`running`&&e.resume().catch(()=>{});let t=e.createBuffer(1,1,22050),n=e.createBufferSource();n.buffer=t,n.connect(e.destination),n.start(0)}loopNoise(){let e=this.ctx.createBufferSource();return e.buffer=this.noise,e.loop=!0,e.start(0,Math.random()*2),e}bp(e,t,n=1){let r=this.ctx.createBiquadFilter();return r.type=e,r.frequency.value=t,r.Q.value=n,r}gain(e=0){let t=this.ctx.createGain();return t.gain.value=e,t}build(){let e=this.ctx;this.master=this.gain(this.muted?0:this.volume);let t=e.createDynamicsCompressor();this.master.connect(t).connect(e.destination),this.noise=e.createBuffer(1,e.sampleRate*2,e.sampleRate);let n=this.noise.getChannelData(0);for(let e=0;e<n.length;e++)n[e]=Math.random()*2-1;this.oscA=e.createOscillator(),this.oscA.type=`sawtooth`,this.oscA.frequency.value=30,this.oscB=e.createOscillator(),this.oscB.type=`square`,this.oscB.frequency.value=15;let r=this.gain(.45),i=e.createWaveShaper(),a=new Float32Array(1024);for(let e=0;e<1024;e++){let t=e/1023*2-1;a[e]=Math.tanh(t*2.2)}i.curve=a,this.engineFilter=this.bp(`lowpass`,500,2.5),this.engineGain=this.gain(0);let o=this.gain(.5);this.oscA.connect(o),this.oscB.connect(r).connect(o),o.connect(i).connect(this.engineFilter).connect(this.engineGain).connect(this.master);let s=this.bp(`lowpass`,160,.7),c=this.gain(.12);this.loopNoise().connect(s).connect(c).connect(this.engineGain),this.oscA.start(),this.oscB.start(),this.analyser=e.createAnalyser(),this.analyser.fftSize=8192,this.engineGain.connect(this.analyser),this.windF=this.bp(`lowpass`,420,.6),this.wind=this.gain(0),this.loopNoise().connect(this.windF).connect(this.wind).connect(this.master);let l=this.bp(`highpass`,1800,.5);this.rain=this.gain(0),this.loopNoise().connect(l).connect(this.rain).connect(this.master);let u=this.bp(`bandpass`,900,.7);this.dirt=this.gain(0),this.loopNoise().connect(u).connect(this.dirt).connect(this.master);let d=this.bp(`bandpass`,3200,.8);this.sandG=this.gain(0),this.loopNoise().connect(d).connect(this.sandG).connect(this.master),this.rockF=this.bp(`bandpass`,1800,1.3),this.rockG=this.gain(0),this.loopNoise().connect(this.rockF).connect(this.rockG).connect(this.master),this.mudF=this.bp(`bandpass`,320,2.5),this.mudG=this.gain(0),this.loopNoise().connect(this.mudF).connect(this.mudG).connect(this.master)}setVolume(e,t){this.volume=e,this.muted=t,this.ctx&&this.master.gain.setTargetAtTime(t?0:e,this.ctx.currentTime,.05)}splash(e){let t=this.ctx;if(!t||t.state!==`running`)return;let n=t.currentTime,r=t.createBufferSource();r.buffer=this.noise;let i=this.bp(`lowpass`,900+e*1800,.8),a=this.gain(0);a.gain.setValueAtTime(0,n),a.gain.linearRampToValueAtTime(.35*Math.min(1,e),n+.02),a.gain.exponentialRampToValueAtTime(.001,n+.5+e*.4),r.connect(i).connect(a).connect(this.master),r.start(n,Math.random()),r.stop(n+1.2)}impact(e){let t=this.ctx;if(!t||t.state!==`running`)return;let n=t.currentTime,r=Math.min(1,e);this.impacts++;let i=t.createOscillator();i.type=`sine`,i.frequency.setValueAtTime(95+r*40,n),i.frequency.exponentialRampToValueAtTime(38,n+.25);let a=this.gain(0);a.gain.setValueAtTime(1e-4,n),a.gain.linearRampToValueAtTime(.55*r,n+.008),a.gain.exponentialRampToValueAtTime(.001,n+.35),i.connect(a).connect(this.master),i.start(n),i.stop(n+.4);let o=t.createBufferSource();o.buffer=this.noise;let s=this.bp(`bandpass`,1400+r*1600,1.4),c=this.gain(0);c.gain.setValueAtTime(1e-4,n),c.gain.linearRampToValueAtTime(.28*r,n+.005),c.gain.exponentialRampToValueAtTime(.001,n+.18+r*.12),o.connect(s).connect(c).connect(this.master),o.start(n,Math.random()),o.stop(n+.5)}chirp(e){let t=this.ctx,n=t.currentTime,r=t.createOscillator(),i=this.gain(0);if(r.type=`sine`,e){r.frequency.value=4400;for(let e=0;e<6;e++)i.gain.setValueAtTime(.02,n+e*.05),i.gain.setValueAtTime(0,n+e*.05+.025);r.connect(i).connect(this.master),r.start(n),r.stop(n+.35)}else{let e=2500+Math.random()*1500;r.frequency.setValueAtTime(e,n),r.frequency.exponentialRampToValueAtTime(e*(Math.random()<.5?.6:1.5),n+.12),i.gain.setValueAtTime(0,n),i.gain.linearRampToValueAtTime(.03,n+.02),i.gain.exponentialRampToValueAtTime(5e-4,n+.15),r.connect(i).connect(this.master),r.start(n),r.stop(n+.2)}}update(e){let t=this.ctx;if(!t||t.state!==`running`)return;let n=t.currentTime,r=.06,i=e.active?1:.35,a=e.rpm/60*2;this.engineHz=a,this.oscA.frequency.setTargetAtTime(a,n,r),this.oscB.frequency.setTargetAtTime(a/2,n,r),this.engineFilter.frequency.setTargetAtTime(300+e.throttle*1600+a*4,n,r),this.engineGain.gain.setTargetAtTime((.16+e.throttle*.22)*i,n,r);let o=Math.min(1,Math.abs(e.speed)/25),s=e.weather,c=s===`fog`?.03:s===`rain`?.08:s===`sunset`?.07:.05;this.wind.gain.setTargetAtTime(c+o*.12,n,.3),this.windF.frequency.setTargetAtTime(350+o*700,n,.3),this.rain.gain.setTargetAtTime(s===`rain`?.16:0,n,.5);let l=Math.min(1,Math.abs(e.speed)/12);this.dirt.gain.setTargetAtTime(e.ground*l*.08*i,n,r),this.sandG.gain.setTargetAtTime(e.sand*(l*.06+e.slip*.1)*i,n,r),this.rockLevel=(e.rock??0)*(l*.11+e.slip*.12)*i,n>this.nextCrunch&&(this.nextCrunch=n+.02+Math.random()*.05,this.rockF.frequency.setTargetAtTime(1200+Math.random()*1800,n,.01),this.rockG.gain.setTargetAtTime(this.rockLevel*(.3+Math.random()*.9),n,.012));let u=e.mud*(l*.5+e.slip*.8)*i;n>this.nextSquelch&&(this.nextSquelch=n+.07+Math.random()*.15,this.mudF.frequency.setTargetAtTime(220+Math.random()*380,n,.03),this.mudG.gain.setTargetAtTime(u*(.15+Math.random()*.35),n,.03)),e.active&&s!==`rain`&&s!==`fog`&&n>this.nextChirp&&(this.nextChirp=n+(s===`night`?.8+Math.random()*1.5:2+Math.random()*5),this.chirp(s===`night`))}measureEngineHz(){if(!this.analyser)return 0;let e=this.analyser.frequencyBinCount,t=new Float32Array(e);this.analyser.getFloatFrequencyData(t);let n=this.ctx.sampleRate/this.analyser.fftSize,r=-1/0,i=0;for(let e=Math.floor(20/n);e<Math.floor(600/n);e++)t[e]>r&&(r=t[e],i=e);return r===-1/0?0:i*n}},pp=class{constructor(e,t,n,r,i,a=!1){Q(this,`gravity`,void 0),Q(this,`drag`,void 0),Q(this,`baseAlpha`,void 0),Q(this,`max`,void 0),Q(this,`pos`,void 0),Q(this,`vel`,void 0),Q(this,`life`,void 0),Q(this,`maxLife`,void 0),Q(this,`size0`,void 0),Q(this,`grow`,void 0),Q(this,`aSize`,void 0),Q(this,`aAlpha`,void 0),Q(this,`aColor`,void 0),Q(this,`geo`,new zn),Q(this,`points`,void 0),Q(this,`cursor`,0),Q(this,`active`,0),Q(this,`spawned`,0),Q(this,`budget`,1),Q(this,`uniforms`,{uScale:{value:500},uTint:{value:new X(1,1,1)}}),this.gravity=n,this.drag=r,this.baseAlpha=i,this.max=t,this.pos=new Float32Array(t*3),this.vel=new Float32Array(t*3),this.life=new Float32Array(t),this.maxLife=new Float32Array(t),this.size0=new Float32Array(t),this.grow=new Float32Array(t),this.aSize=new Float32Array(t),this.aAlpha=new Float32Array(t),this.aColor=new Float32Array(t*3),this.geo.setAttribute(`position`,new wn(this.pos,3).setUsage(se)),this.geo.setAttribute(`aSize`,new wn(this.aSize,1).setUsage(se)),this.geo.setAttribute(`aAlpha`,new wn(this.aAlpha,1).setUsage(se)),this.geo.setAttribute(`aColor`,new wn(this.aColor,3).setUsage(se));let o=new Ra({uniforms:this.uniforms,transparent:!0,depthWrite:!1,blending:a?2:1,vertexShader:`attribute float aSize; attribute float aAlpha; attribute vec3 aColor; uniform float uScale;
        varying float vA; varying vec3 vC;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uScale / max(0.5, -mv.z); vA = aAlpha; vC = aColor; }`,fragmentShader:`uniform vec3 uTint; varying float vA; varying vec3 vC;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = dot(c,c); if (d > 0.25) discard;
          gl_FragColor = vec4(vC * uTint, vA * smoothstep(0.25, 0.05, d));
          #include <colorspace_fragment>
        }`});this.points=new Wr(this.geo,o),this.points.frustumCulled=!1,e.add(this.points)}emit(e,t,n,r,i,a,o=.3){let s=this.cursor;this.cursor=(this.cursor+1)%this.max,this.life[s]<=0&&this.active++,this.pos[s*3]=e.x+(Math.random()-.5)*o,this.pos[s*3+1]=e.y+Math.random()*o*.5,this.pos[s*3+2]=e.z+(Math.random()-.5)*o,this.vel[s*3]=t.x,this.vel[s*3+1]=t.y,this.vel[s*3+2]=t.z,this.life[s]=this.maxLife[s]=n*(.7+Math.random()*.6),this.size0[s]=r*(.7+Math.random()*.6),this.grow[s]=i;let c=.85+Math.random()*.3;this.aColor[s*3]=a.r*c,this.aColor[s*3+1]=a.g*c,this.aColor[s*3+2]=a.b*c,this.spawned++}update(e,t){let n=0,r=Math.max(0,1-this.drag*e);for(let i=0;i<this.max;i++){if(this.life[i]<=0||(this.life[i]-=e,this.life[i]<=0)){this.aAlpha[i]=0,this.aSize[i]=0;continue}n++;let a=i*3;if(this.vel[a+1]-=this.gravity*e,this.vel[a]*=r,this.vel[a+1]*=r,this.vel[a+2]*=r,this.pos[a]+=this.vel[a]*e,this.pos[a+1]+=this.vel[a+1]*e,this.pos[a+2]+=this.vel[a+2]*e,this.gravity>0){let e=t(this.pos[a],this.pos[a+2]);this.pos[a+1]<e&&(this.pos[a+1]=e,this.vel[a]*=.3,this.vel[a+1]=0,this.vel[a+2]*=.3,this.life[i]=Math.min(this.life[i],.25))}let o=1-this.life[i]/this.maxLife[i];this.aSize[i]=this.size0[i]*(1+this.grow[i]*o),this.aAlpha[i]=this.baseAlpha*Math.min(1,(1-o)*1.6)*Math.min(1,o*12+.2)}this.active=n;for(let e of[`position`,`aSize`,`aAlpha`,`aColor`])this.geo.attributes[e].needsUpdate=!0}},mp=class{constructor(e,t){Q(this,`mesh`,void 0),Q(this,`uniforms`,{uTime:{value:0},uCam:{value:new K},uOpacity:{value:.45}});let n=new Float32Array(t*2*3),r=new Float32Array(t*2);for(let e=0;e<t;e++){let t=Math.random()*50,i=Math.random()*28,a=Math.random()*50;n.set([t,i,a,t,i,a],e*6),r[e*2]=0,r[e*2+1]=1}let i=new zn;i.setAttribute(`position`,new wn(n,3)),i.setAttribute(`aEnd`,new wn(r,1));let a=new Ra({transparent:!0,depthWrite:!1,uniforms:this.uniforms,vertexShader:`attribute float aEnd; uniform float uTime; uniform vec3 uCam;
        void main(){ float W = ${50 .toFixed(1)}; float H = ${28 .toFixed(1)};
          vec3 p = position; p.y = mod(p.y - uTime * 22.0, H) + uCam.y - H * 0.45;
          p.x = uCam.x + mod(p.x - uCam.x, W) - W * 0.5; p.z = uCam.z + mod(p.z - uCam.z, W) - W * 0.5;
          p += vec3(0.08, 0.55, 0.02) * aEnd;
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }`,fragmentShader:`uniform float uOpacity; void main(){ gl_FragColor = vec4(0.75, 0.8, 0.88, uOpacity); }`});this.mesh=new Rr(i,a),this.mesh.frustumCulled=!1,this.mesh.visible=!1,e.add(this.mesh)}update(e,t){this.uniforms.uTime.value=e,this.uniforms.uCam.value.copy(t)}setDensity(e){let t=this.mesh.geometry;t.setDrawRange(0,Math.floor(t.attributes.position.count/2*e)*2)}},hp=[`clear`,`sunset`,`fog`,`rain`,`night`],gp={clear:{cloud:.45,cloudCol:16777215,label:`Clear day`,icon:`☀`,skyTop:5211846,skyBottom:13227740,fog:12898260,fogNear:60,fogFar:340,sun:16773336,sunI:2.8,sunDir:[.55,.8,.25],hemiSky:14674175,hemiGround:5916208,hemiI:1.1,exposure:1,fill:0,rim:0,env:.7,tint:16777215,headlights:!1,rain:!1,wet:!1,stars:!1,dust:1},sunset:{cloud:.55,cloudCol:16761754,label:`Sunset dunes`,icon:`🌅`,skyTop:3817331,skyBottom:15764028,fog:14256722,fogNear:50,fogFar:300,sun:16751178,sunI:3.2,sunDir:[.85,.16,-.5],hemiSky:16756858,hemiGround:4861984,hemiI:.7,exposure:1.05,fill:2.5,rim:3,env:.55,tint:16756874,headlights:!0,rain:!1,wet:!1,stars:!1,dust:1.3},fog:{cloud:0,cloudCol:10134182,label:`Dense fog`,icon:`🌫`,skyTop:10134182,skyBottom:10134182,fog:10134182,fogNear:4,fogFar:62,sun:15133935,sunI:.9,sunDir:[.3,.9,.2],hemiSky:13226712,hemiGround:5919816,hemiI:1.25,exposure:1,fill:2,rim:1.5,env:.45,tint:13159632,headlights:!0,rain:!1,wet:!0,stars:!1,dust:.3},rain:{cloud:1,cloudCol:6055020,label:`Rain`,icon:`🌧`,skyTop:4937056,skyBottom:8226703,fog:7305344,fogNear:15,fogFar:150,sun:13161180,sunI:.9,sunDir:[.4,.85,.3],hemiSky:11187906,hemiGround:3814440,hemiI:1,exposure:1,fill:2.5,rim:2,env:.5,tint:10133672,headlights:!0,rain:!0,wet:!0,stars:!1,dust:0},night:{cloud:.35,cloudCol:1712694,label:`Night`,icon:`🌙`,skyTop:329746,skyBottom:1055276,fog:725536,fogNear:20,fogFar:170,sun:9414911,sunI:.35,sunDir:[-.4,.7,.4],hemiSky:3821440,hemiGround:1315084,hemiI:.45,exposure:1.1,fill:4.5,rim:5,env:.05,tint:2501690,headlights:!0,rain:!1,wet:!1,stars:!0,dust:.6}};function _p(e){let t=new Float32Array(2700);for(let e=0;e<900;e++){let n=Math.random()*Math.PI*2,r=Math.acos(1-Math.random()*.95);t.set([Math.sin(r)*Math.cos(n)*550,Math.cos(r)*550,Math.sin(r)*Math.sin(n)*550],e*3)}let n=new zn;n.setAttribute(`position`,new wn(t,3));let r=new Wr(n,new zr({color:16777215,size:1.6,sizeAttenuation:!1,fog:!1,transparent:!0,opacity:.85}));return r.visible=!1,r.frustumCulled=!1,e.add(r),r}var vp={off:0,low:.45,medium:1,high:1.7},yp=`owf.settings.v1`,bp=4,xp=()=>window.matchMedia(`(pointer: coarse)`).matches||navigator.maxTouchPoints>0;function Sp(){let e={preset:xp()?`medium`:`high`,showFps:!0,touch:`auto`,weather:`clear`,volume:.8,muted:!1,intro:!0,vehicle:`scout`,paints:{},controls:`wheel`,autoThrottle:xp(),camDist:1,camHeight:1,shake:!0,wheelSens:1,ctlV:bp,shakeLevel:`medium`,profile:`pro`};try{let t={...e,...JSON.parse(localStorage.getItem(yp)||`{}`)};return(t.ctlV??0)<bp&&(t.controls=e.controls,t.autoThrottle=e.autoThrottle,t.ctlV=bp),t.shakeLevel||(t.shakeLevel=t.shake===!1?`off`:`medium`),t}catch{return e}}function Cp(e){try{localStorage.setItem(yp,JSON.stringify(e))}catch{}}var wp={low:{pixelRatio:.75,shadows:!1,shadowSize:512,fogFar:170,headlights:!0,aa:!1,particles:.35,rain:.3,beamShadow:!1},medium:{pixelRatio:1.25,shadows:!0,shadowSize:1024,fogFar:260,headlights:!0,aa:!0,particles:.7,rain:.6,beamShadow:!0},high:{pixelRatio:2,shadows:!0,shadowSize:2048,fogFar:340,headlights:!0,aa:!0,particles:1,rain:1,beamShadow:!0}},Tp=(e,t)=>Math.atan2(e,t);function Ep(e,t=12){return e.map(([n,r],i)=>{let a=e[Math.max(0,i-1)],o=e[Math.min(e.length-1,i+1)];return{x:n,z:r,yaw:Tp(o[0]-a[0],o[1]-a[1]),w:t}})}var Dp=(e,t=14)=>({x:e.x-Math.sin(e.yaw)*t,z:e.z-Math.cos(e.yaw)*t,yaw:e.yaw}),Op=[];for(let e=0;e<=8;e++){let t=Math.PI+e/8*Math.PI*2;Op.push([80+Math.cos(t)*26,-55-Math.sin(t)*38])}Op[8]=[Op[0][0],Op[0][1]];var kp=Ep(Op);kp[0].yaw=kp[8].yaw=Tp(Op[1][0]-Op[7][0],Op[1][1]-Op[7][1]);var Ap=Ep(ad),jp=[...kp.slice(1),...kp.slice(1)],Mp=e=>e.map(e=>({x:e.x,z:e.z})),Np=td.map(e=>{let t=$u[Math.max(0,e-1)],n=$u[Math.min($u.length-1,e+1)];return{x:$u[e].x,z:$u[e].z,yaw:Tp(n.x-t.x,n.z-t.z),w:9}}).slice(1),Pp=Ep(od,14).slice(1),Fp={x:od[0][0]+8,z:od[0][1]-10,yaw:Tp(od[1][0]-od[0][0]-8,od[1][1]-od[0][1]+10)},Ip={"race-loop":43.88,"race-dash":38.55,"ch-mud":15.95,"ch-climb":63.5,"rs-tow":37.3,"rs-deliver":65.02},Lp={gold:1.2,silver:1.5,bronze:2},Rp=e=>Math.round(e*2)/2,zp=e=>({gold:Rp(Ip[e]*Lp.gold),silver:Rp(Ip[e]*Lp.silver),bronze:Rp(Ip[e]*Lp.bronze)}),Bp=[{id:`race-loop`,mode:`race`,type:`race`,title:`Dune Loop`,desc:`Two laps of the desert: flat apron and rolling dunes. 16 checkpoints.`,start:Dp(kp[0],-4),gates:jp,laps:2,limit:null,targets:zp(`race-loop`),reward:320},{id:`race-dash`,mode:`race`,type:`race`,title:`Canyon Dash`,desc:`Point-to-point sprint across the dune field and up the canyon rim and back to base. 13 checkpoints.`,start:Dp(Ap[0]),gates:Ap,limit:null,targets:zp(`race-dash`),reward:320},{id:`ch-mud`,mode:`challenge`,type:`mudrun`,title:`Mud Crossing`,desc:`Cross the mud basin through both gates within the time limit. No resets allowed.`,start:{x:-72,z:1,yaw:0},gates:Ep([[-72,30],[-72,78]],14),limit:30,noReset:!0,targets:zp(`ch-mud`),reward:250},{id:`ch-climb`,mode:`challenge`,type:`climb`,title:`Ridge Climb`,desc:`Switchback trail up the rocky mountain: steep loose-rock sections and tight hairpins. Reach the summit flag; do not roll over.`,start:{...md.start},gates:Np,limit:150,zone:{x:md.summit.x,z:md.summit.z,r:7},path:Mp($u),targets:zp(`ch-climb`),reward:420},{id:`rs-tow`,mode:`rescue`,type:`tow`,title:`Bogged Down`,desc:`A 4x4 is stuck deep in the mud basin. Reach it, hook up the tow rope (H / Hook) and drag it well inside the safe zone.`,start:{x:-14,z:34,yaw:-Math.PI/2},gates:[],limit:150,zone:{x:-22,z:48,r:7},stuck:{x:-60,z:46,yaw:Math.PI/2},targets:zp(`rs-tow`),reward:450},{id:`rs-deliver`,mode:`rescue`,type:`deliver`,title:`Supply Run`,desc:`Cross the map with supplies — mud basin, proving ground, eastern hills and dunes — and stop at the stranded camp before night falls.`,start:Fp,gates:Pp,limit:120,zone:{x:sd.x,z:sd.z,r:8},path:[{x:Fp.x,z:Fp.z},...od.map(([e,t])=>({x:e,z:t})),sd],targets:zp(`rs-deliver`),reward:500}],Vp=e=>Bp.find(t=>t.id===e);function Hp(e,t){return e<=t.gold?`gold`:e<=t.silver?`silver`:e<=t.bronze?`bronze`:`none`}var Up=class{jumped(){this.prev=null,this.anchor=null,this.stillT=0}constructor(e){Q(this,`def`,void 0),Q(this,`state`,`countdown`),Q(this,`countdown`,3),Q(this,`t`,0),Q(this,`next`,0),Q(this,`splits`,[]),Q(this,`rejected`,0),Q(this,`resets`,0),Q(this,`msg`,``),Q(this,`msgT`,0),Q(this,`wrongT`,0),Q(this,`flipT`,0),Q(this,`failReason`,``),Q(this,`zoneHold`,0),Q(this,`last`,void 0),Q(this,`attached`,!1),Q(this,`reached`,!1),Q(this,`anchor`,null),Q(this,`stillT`,0),Q(this,`prev`,null),Q(this,`log`,[]),this.def=e,this.last={...e.start}}get finished(){return this.state===`success`||this.state===`fail`}say(e,t=1.6){this.log[this.log.length-1]!==e&&(this.log.push(e),this.log.length>30&&this.log.shift()),this.msg=e,this.msgT=t}requestReset(){return this.state===`running`?this.def.noReset?(this.fail(`Reset used — challenge failed`),!1):this.def.maxResets!==void 0&&this.resets>=this.def.maxResets?(this.fail(`No recoveries left`),!1):(this.resets++,this.prev=null,this.say(`Reset to last checkpoint`),!0):!1}fail(e){this.finished||(this.state=`fail`,this.failReason=e)}succeed(){this.finished||(this.state=`success`)}update(e,t,n={}){if(this.msgT>0&&(this.msgT-=e),this.state===`countdown`){this.countdown-=e,this.prev={x:t.x,z:t.z},this.countdown<=0&&(this.state=`running`,this.say(this.def.tips?.[-1]??`GO!`,this.def.tips?.[-1]?3.5:1),this.anchor={x:t.x,z:t.z});return}if(this.state!==`running`)return;this.t+=e;let r=this.def;if(this.prev&&r.gates.length)for(let e=0;e<r.gates.length;e++){let n=r.gates[e],i=Wp(this.prev,t,n);i&&(e>this.next&&r.gates.findIndex(e=>Math.hypot(e.x-n.x,e.z-n.z)<.5)<e||(i<0?this.say(`Wrong way!`):e===this.next?(this.splits.push(this.t),this.next++,this.last={x:n.x,z:n.z,yaw:n.yaw},this.next>=r.gates.length?r.type===`race`||r.type===`mudrun`?this.succeed():r.tips?.[e]&&this.say(r.tips[e],3):r.tips?.[e]?this.say(r.tips[e],3):this.say(`Checkpoint ${this.next}/${r.gates.length}`,1.2)):e>this.next&&(this.rejected++,this.say(`Missed checkpoint ${this.next+1}!`,2))))}if(this.prev={x:t.x,z:t.z},r.path&&Math.abs(t.speed)>3){let n=0,i=1/0;for(let e=0;e<r.path.length-1;e++){let a=r.path[e],o=(a.x-t.x)**2+(a.z-t.z)**2;o<i&&(i=o,n=e)}let a=r.path[n],o=r.path[n+1],s=Math.hypot(o.x-a.x,o.z-a.z)||1,c=(Math.sin(t.yaw)*(o.x-a.x)+Math.cos(t.yaw)*(o.z-a.z))/s*Math.sign(t.speed);this.wrongT=c<-.5&&i<400?this.wrongT+e:0,this.wrongT>1.5&&this.say(`Wrong way!`,.3)}else if(this.next<r.gates.length&&Math.abs(t.speed)>3){let n=r.gates[this.next],i=n.x-t.x,a=n.z-t.z,o=Math.hypot(i,a)||1,s=(Math.sin(t.yaw)*i+Math.cos(t.yaw)*a)/o*Math.sign(t.speed);this.wrongT=s<-.3?this.wrongT+e:0,this.wrongT>1&&this.say(`Wrong way!`,.3)}else this.wrongT=0;let i=e=>!!r.zone&&Math.hypot(e.x-r.zone.x,e.z-r.zone.z)<r.zone.r;if(r.type===`climb`)this.flipT=t.up<.35?this.flipT+e:0,this.flipT>2.5&&this.fail(`Rolled over`),i(t)&&this.next>=r.gates.length?this.succeed():i(t)&&this.say(`Missed checkpoint ${this.next+1}!`,.5);else if(r.type===`deliver`||r.type===`trail`){let e=this.next>=r.gates.length;i(t)&&e&&Math.abs(t.speed)<4?this.succeed():i(t)&&!e?this.say(`Missed checkpoint ${this.next+1}!`,.5):i(t)&&this.say(`Slow down and stop at the camp`,.3)}else if(r.type===`tow`&&n.stuck){let a=Math.hypot(t.x-n.stuck.x,t.z-n.stuck.z);!this.reached&&a<9&&(this.reached=!0,this.say(`Hook up the tow rope (H / Hook)`,3));let o=r.zone?Math.hypot(n.stuck.x-r.zone.x,n.stuck.z-r.zone.z):1/0,s=!!r.zone&&o<=r.zone.r-2;this.zoneHold=this.attached&&s?this.zoneHold+e:0,this.attached&&i(n.stuck)&&!s?this.say(`Pull it further into the safe zone`,.3):this.zoneHold>0&&this.say(`Hold it there…`,.3),this.zoneHold>=1&&this.succeed()}r.stuckFail&&!this.finished&&(!this.anchor||Math.hypot(t.x-this.anchor.x,t.z-this.anchor.z)>2?(this.anchor={x:t.x,z:t.z},this.stillT=0):(this.stillT+=e,this.stillT>r.stuckFail*.5&&this.stillT-e<=r.stuckFail*.5&&this.say(`Stuck? Reverse out or reset (R)`,3)),this.stillT>=r.stuckFail&&this.fail(`Stuck in the mud`)),r.limit!==null&&this.t>=r.limit&&!this.finished&&(this.t=r.limit,this.fail(r.type===`deliver`?`Night fell before the supplies arrived`:`Out of time`))}};function Wp(e,t,n){let r=Math.sin(n.yaw),i=Math.cos(n.yaw),a=(e.x-n.x)*r+(e.z-n.z)*i,o=(t.x-n.x)*r+(t.z-n.z)*i;if(a<0==o<0)return 0;let s=a/(a-o),c=e.x+(t.x-e.x)*s-n.x,l=e.z+(t.z-e.z)*s-n.z,u=c*i-l*r;return Math.abs(u)>n.w/2?0:o>a?1:-1}var Gp=class{constructor(e,t){Q(this,`scene`,void 0),Q(this,`group`,new Ft),Q(this,`gates`,[]),Q(this,`rope`,null),Q(this,`disposables`,[]),Q(this,`lapLen`,1/0),this.scene=e,e.add(this.group);let n=t.laps?t.gates.length/t.laps:t.gates.length;if(t.gates.forEach((e,r)=>this.addGate(e,r===t.gates.length-1&&(t.type===`race`||t.type===`mudrun`)?`FINISH`:String(r%n+1))),t.zone&&((t.type===`climb`||t.type===`trail`)&&this.addFlag(t.zone.x,t.zone.z),t.type===`deliver`&&this.addCamp(t.zone.x,t.zone.z),this.addZone(t.zone.x,t.zone.z,t.zone.r,t.type===`tow`?3659386:t.type===`deliver`?16756794:16734778)),t.type===`tow`){let e=new $r(.025,.025,1,6);e.translate(0,.5,0),e.rotateX(Math.PI/2);let t=new Ba({color:16761402,roughness:.6});this.rope=new lr(e,t),this.rope.visible=!1,this.group.add(this.rope),this.disposables.push(e,t)}}mat(e){let t=new Ba(e);return this.disposables.push(t),t}geo(e){return this.disposables.push(e),e}label(e){let t=document.createElement(`canvas`);t.width=480,t.height=64;let n=t.getContext(`2d`);n.fillStyle=`#1b1408`,n.fillRect(0,0,480,64),n.fillStyle=`#fff`,n.font=`bold 44px system-ui, sans-serif`,n.textAlign=`center`,n.textBaseline=`middle`,n.fillText(e,240,34);let r=new qr(t);return r.colorSpace=re,this.disposables.push(r),r}addGate(e,t){let n=new Ft,r=Math.sin(e.yaw),i=Math.cos(e.yaw),a=-r,o=this.mat({color:15921906,emissive:0,roughness:.5}),s=this.label(t),c=this.mat({color:16777215,map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.15,side:2}),l=this.geo(new $r(.16,.2,4.6,8)),u=-1/0;for(let t of[-1,1]){let r=e.x+i*t*e.w/2,s=e.z+a*t*e.w/2,c=wd(r,s),d=new lr(l,o);d.position.set(r,c+2.3,s),n.add(d),u=Math.max(u,c+4.4)}let d=new lr(this.geo(new Sa(e.w,1.6)),c);d.position.set(e.x,u,e.z),d.rotation.y=e.yaw+Math.PI,n.add(d),this.group.add(n),this.gates.push({g:n,banner:c,posts:o})}setGateState(e){this.gates.forEach((t,n)=>{t.g.visible=n>=e&&n<e+this.lapLen;let r=n===e;t.posts.color.set(r?16756794:15921906),t.posts.emissive.set(r?8014336:0),t.banner.emissiveIntensity=r?.7:.12,t.banner.color.set(r?16760928:11579568),t.banner.emissive.set(r?16754216:16777215)})}addFlag(e,t){let n=wd(e,t),r=new lr(this.geo(new $r(.06,.06,6,8)),this.mat({color:14540253,metalness:.6,roughness:.3}));r.position.set(e,n+3,t);let i=new lr(this.geo(new Sa(1.8,1.1)),this.mat({color:14692894,emissive:5900800,side:2}));i.position.set(e+.9,n+5.4,t),this.group.add(r,i)}addZone(e,t,n,r){let i=wd(e,t),a=new lr(this.geo(new Ca(n-.5,n,48)),this.mat({color:r,emissive:r,emissiveIntensity:.6,transparent:!0,opacity:.85,side:2,depthWrite:!1}));a.rotation.x=-Math.PI/2,a.position.set(e,i+.35,t);let o=new Zn({color:r,transparent:!0,opacity:.16,depthWrite:!1,side:2});this.disposables.push(o);let s=new lr(this.geo(new $r(n,n,14,32,1,!0)),o);s.position.set(e,i+7,t),this.group.add(a,s)}addCamp(e,t){let n=wd(e,t),r=this.mat({color:6257234,roughness:.9}),i=this.mat({color:9071162,roughness:.8});for(let[n,i,a]of[[-3,2,1.2],[2.5,3,1]]){let o=new lr(this.geo(new ei(1.6*a,2*a,4)),r);o.position.set(e+n,wd(e+n,t+i)+a,t+i),o.rotation.y=.6,this.group.add(o)}let a=new lr(this.geo(new ei(.35,.8,7)),this.mat({color:16742938,emissive:16738816,emissiveIntensity:2}));a.position.set(e,n+.4,t-2),this.group.add(a);for(let[n,r]of[[3.5,-2],[4.1,-1.2]]){let a=new lr(this.geo(new Zr(.7,.6,.7)),i);a.position.set(e+n,wd(e+n,t+r)+.3,t+r),this.group.add(a)}}setRope(e,t){this.rope&&(this.rope.visible=!!e,e&&t&&(this.rope.position.copy(e),this.rope.lookAt(t),this.rope.scale.set(1,1,e.distanceTo(t))))}dispose(){this.scene.remove(this.group);for(let e of this.disposables)e.dispose()}},Kp=`owf.save`,qp=[`engine`,`tyres`,`susp`],Jp={scout:{level:1,price:0},f110:{level:1,price:0},pickup:{level:2,price:1200},voyager:{level:2,price:1600},recovery:{level:3,price:2e3},rally:{level:3,price:2400},sahara:{level:4,price:3e3},van:{level:2,price:1500},ltv:{level:2,price:1800},patrol:{level:3,price:2600},cargo6:{level:4,price:3200},mrap:{level:5,price:4e3}},Yp=e=>{let t=ip.findIndex(t=>t.hex===e);return t<3?1:Math.min(5,2+(t-3>>1))},Xp=e=>1+Math.floor(e/300),Zp=e=>400*(e+1);function Qp(){return{v:2,credits:0,xp:0,vehicles:[`scout`],paints:ip.slice(0,3).map(e=>e.hex),upgrades:{},best:{},runs:0}}var $p=(e,t=0)=>typeof e==`number`&&Number.isFinite(e)&&e>=0?e:t;function em(e){let t=Qp();if(!e||typeof e!=`object`)return t;let n=e;if(n.version===1&&n.v===void 0){if(t.credits=$p(n.cash),Array.isArray(n.unlocked)&&(t.vehicles=[...new Set([`scout`,...n.unlocked.filter(e=>np.some(t=>t.id===e))])]),n.bestTimes&&typeof n.bestTimes==`object`)for(let[e,r]of Object.entries(n.bestTimes))$p(r,-1)>0&&(t.best[e]={time:r,medal:`none`});return t}if(typeof n.v==`number`&&n.v,t.credits=$p(n.credits),t.xp=$p(n.xp),t.runs=$p(n.runs),Array.isArray(n.vehicles)&&(t.vehicles=[...new Set([`scout`,...n.vehicles.filter(e=>np.some(t=>t.id===e))])]),Array.isArray(n.paints)&&(t.paints=[...new Set([...t.paints,...n.paints.filter(e=>ip.some(t=>t.hex===e))])]),n.upgrades&&typeof n.upgrades==`object`)for(let[e,r]of Object.entries(n.upgrades))np.some(t=>t.id===e)&&r&&typeof r==`object`&&(t.upgrades[e]={engine:Math.min(3,Math.floor($p(r.engine))),tyres:Math.min(3,Math.floor($p(r.tyres))),susp:Math.min(3,Math.floor($p(r.susp)))});if(n.best&&typeof n.best==`object`)for(let[e,r]of Object.entries(n.best))r&&$p(r.time,-1)>0&&(t.best[e]={time:r.time,medal:[`gold`,`silver`,`bronze`].includes(r.medal)?r.medal:`none`,...Array.isArray(r.splits)&&r.splits.every(e=>$p(e,-1)>=0)?{splits:r.splits}:{}});return t}function tm(){try{return em(JSON.parse(localStorage.getItem(`owf.save`)||`null`))}catch{return Qp()}}function nm(e){try{localStorage.setItem(Kp,JSON.stringify(e))}catch{}}var rm=()=>{try{return/[?&]dev=1/.test(location.search)||localStorage.getItem(`owf.dev`)===`1`}catch{return!1}},im=(e,t)=>rm()||e.vehicles.includes(t),am=(e,t)=>rm()||e.paints.includes(t),om=(e,t)=>e.upgrades[t]??{engine:0,tyres:0,susp:0};function sm(e,t){let n={...e,grip:{...e.grip},susp:{...e.susp},wheel:{...e.wheel}};n.engine=e.engine*(1+.09*t.engine),n.topSpeed=e.topSpeed*(1+.03*t.engine);let r=1+.07*t.tyres;return n.grip={ground:e.grip.ground*r,sand:e.grip.sand*r,mud:e.grip.mud*r},n.side=e.side*(1+.04*t.tyres),n.susp={...e.susp,travel:e.susp.travel*(1+.1*t.susp),stiffness:e.susp.stiffness*(1+.08*t.susp),rest:e.susp.rest+.03*t.susp},n}function cm(e,t,n,r,i){let a={gold:2,silver:1.5,bronze:1.2,none:1}[r],o=n===null?0:Math.round(i*a),s=n===null?10:Math.round(i*.6*a),c=Xp(e.xp);e.credits+=o,e.xp+=s,e.runs++;let l=e.best[t],u=n!==null&&(!l||n<l.time),d={gold:3,silver:2,bronze:1,none:0};u?e.best[t]={time:n,medal:l&&d[l.medal]>d[r]?l.medal:r}:l&&d[r]>d[l.medal]&&(l.medal=r);let f=Xp(e.xp);for(let t of ip)Yp(t.hex)<=f&&!e.paints.includes(t.hex)&&e.paints.push(t.hex);return{credits:o,xp:s,newBest:u,levelUp:f>c?f:0}}var lm=1/60,um={throttle:0,brake:0,steer:0,handbrake:!0},dm=Vp(`race-dash`),fm=e=>[+e.throttle.toFixed(3),+e.brake.toFixed(3),+e.steer.toFixed(3),+!!e.handbrake];function pm(e){let t=e.body.translation(),n=e.body.rotation(),r=e.body.linvel(),i=e.body.angvel();return{p:[t.x,t.y,t.z],q:[n.x,n.y,n.z,n.w],lv:[r.x,r.y,r.z],av:[i.x,i.y,i.z],steer:e.steer,susp:e.suspLengths()}}function mm(e,t){let n=e.body;n.setTranslation({x:t.p[0],y:t.p[1],z:t.p[2]},!0),n.setRotation({x:t.q[0],y:t.q[1],z:t.q[2],w:t.q[3]},!0),n.setLinvel({x:t.lv[0],y:t.lv[1],z:t.lv[2]},!0),n.setAngvel({x:t.av[0],y:t.av[1],z:t.av[2]},!0),e.steer=t.steer}var hm=76;function gm(e){let t=new DataView(e);if(e.byteLength<12||t.getUint8(0)!==1)return null;let n=t.getUint8(1),r=t.getUint32(4,!0),i=t.getUint32(8,!0),a=[];if(e.byteLength<12+n*hm)return null;for(let e=0;e<n;e++){let n=12+e*hm,r=[];for(let e=0;e<18;e++)r.push(t.getFloat32(n+4+e*4,!0));a.push({id:t.getUint8(n),away:(t.getUint8(n+1)&1)==1,p:[r[0],r[1],r[2]],q:[r[3],r[4],r[5],r[6]],lv:[r[7],r[8],r[9]],av:[r[10],r[11],r[12]],steer:r[13],susp:[r[14],r[15],r[16],r[17]]})}return{tick:r,ack:i,players:a}}var _m=`owf.mp.token`,vm=class{constructor(e){Q(this,`url`,void 0),Q(this,`ws`,null),Q(this,`status`,`offline`),Q(this,`rtt`,0),Q(this,`rttSamples`,[]),Q(this,`lastError`,``),Q(this,`reconnects`,0),Q(this,`attempt`,0),Q(this,`lostAt`,0),Q(this,`intentional`,!1),Q(this,`pingTimer`,0),Q(this,`retryTimer`,0),Q(this,`profile`,{name:`Driver`,vehicle:`scout`,paint:0}),Q(this,`onStatus`,()=>{}),Q(this,`onMsg`,()=>{}),Q(this,`onSnap`,()=>{}),Q(this,`onReady`,()=>{}),Q(this,`bytesIn`,0),Q(this,`msgsOut`,0),this.url=e}get token(){return sessionStorage.getItem(_m)}set token(e){e?sessionStorage.setItem(_m,e):sessionStorage.removeItem(_m)}set(e){this.status!==e&&(this.status=e,this.onStatus(e))}connect(){if(this.ws&&(this.ws.readyState===WebSocket.OPEN||this.ws.readyState===WebSocket.CONNECTING))return;this.intentional=!1,this.set(this.status===`reconnecting`?`reconnecting`:`connecting`);let e;try{e=new WebSocket(this.url)}catch(e){this.lastError=String(e),this.closed();return}e.binaryType=`arraybuffer`,this.ws=e,e.onopen=()=>{this.send({t:`hello`,proto:1,...this.profile,token:this.token})},e.onmessage=e=>{if(typeof e.data!=`string`){this.bytesIn+=e.data.byteLength,this.onSnap(e.data);return}this.bytesIn+=e.data.length;let t;try{t=JSON.parse(e.data)}catch{return}if((t.t===`ready`||t.t===`joined`)&&(this.attempt=0,this.set(`online`),this.startPing()),t.t===`joined`&&(this.token=t.token),t.t===`err`&&t.code===`expired`&&(this.token=null),t.t===`pong`){let e=performance.now()-t.c;this.rttSamples.push(e),this.rttSamples.length>10&&this.rttSamples.shift(),this.rtt=[...this.rttSamples].sort((e,t)=>e-t)[Math.floor(this.rttSamples.length/2)]}t.t===`ready`&&this.onReady(),this.onMsg(t)},e.onclose=t=>{this.ws===e&&(this.ws=null,this.lastError=t.reason||`closed (${t.code})`,this.closed(t.code))},e.onerror=()=>{}}startPing(){clearInterval(this.pingTimer);let e=()=>this.send({t:`ping`,c:performance.now(),rtt:Math.round(this.rtt)});e(),this.pingTimer=window.setInterval(e,2e3)}closed(e=0){clearInterval(this.pingTimer);let t=e===4003||e===4008||e===4001;if(!this.intentional&&!t&&this.token){if(this.status!==`reconnecting`&&(this.lostAt=performance.now(),this.set(`reconnecting`)),performance.now()-this.lostAt>35e3){this.token=null,this.set(`offline`),this.onMsg({t:`lost`});return}let e=Math.min(3e3,400*2**this.attempt++);this.reconnects++,this.retryTimer=window.setTimeout(()=>this.connect(),e)}else this.set(`offline`),t&&(this.token=null,this.onMsg({t:`lost`,kicked:!0,reason:this.lastError}))}send(e){return this.ws?.readyState===WebSocket.OPEN&&(this.ws.send(JSON.stringify(e)),this.msgsOut++,!0)}sendRaw(e){return this.ws?.readyState===WebSocket.OPEN&&(this.ws.send(e),!0)}disconnect(){this.intentional=!0,clearTimeout(this.retryTimer),clearInterval(this.pingTimer),this.token=null,this.ws?.close(1e3,`bye`),this.ws=null,this.set(`offline`)}dropConnection(){this.ws?.close(4100,`simulated drop`)}},ym=e=>document.getElementById(e),bm={add(){},lift(){},reset(){}},xm=e=>e.replace(/[&<>"']/g,e=>`&#${e.charCodeAt(0)};`),Sm=e=>`${Math.floor(e/60)}:${(e%60).toFixed(2).padStart(5,`0`)}`,Cm=e=>rp(e).name,wm=e=>ip.find(t=>t.hex===e)?.name??`Custom`,Tm={offline:`Offline`,connecting:`Connecting…`,online:`Online`,reconnecting:`Reconnecting…`},Em=`The online server is not hosted yet, so online rooms are unavailable on this site. Use Local split-screen for 2 players on one device.`,Dm=class{constructor(e){Q(this,`ctx`,void 0),Q(this,`net`,void 0),Q(this,`room`,null),Q(this,`myId`,0),Q(this,`remotes`,new Map),Q(this,`hist`,[]),Q(this,`seq`,0),Q(this,`lastAck`,0),Q(this,`synced`,!1),Q(this,`histFirst`,()=>this.hist[0]?.s??-1),Q(this,`pending`,[]),Q(this,`lastFlush`,0),Q(this,`acc`,0),Q(this,`offset`,null),Q(this,`jitter`,0),Q(this,`interpDelay`,.1),Q(this,`lastTick`,0),Q(this,`visOff`,new K),Q(this,`visQ`,new Be),Q(this,`pendingAction`,null),Q(this,`mworld`,null),Q(this,`wpMesh`,null),Q(this,`configured`,!1),Q(this,`hudT`,0),Q(this,`lastErr`,``),Q(this,`ready`,!1),Q(this,`pilot`,null),Q(this,`metrics`,{snaps:0,corrections:0,hardSnaps:0,maxErr:0,errs:[],corrErrs:[],maxVisOff:0,extrap:0,noHist:0,bigJump:0,waiting:0,nhLog:[],remoteJerk:[],ownJerk:[],replaySteps:0}),Q(this,`lastOwn`,null),this.ctx=e;let t=new URLSearchParams(location.search),n=/github\.io$/i.test(location.hostname),r=t.get(`server`)||(n?``:`${location.protocol===`https:`?`wss`:`ws`}://${location.host}/ws`);this.configured=!!r;let i=t.get(`simlag`),a=t.get(`simjitter`);(i||a)&&(r+=(r.includes(`?`)?`&`:`?`)+`simlag=${i??0}&simjitter=${a??0}`),this.net=new vm(r),this.net.onStatus=()=>{this.renderLobby(),this.renderStatus()},this.net.onReady=()=>{this.ready=!0,this.pendingAction&&(this.net.send(this.pendingAction),this.pendingAction=null)},this.net.onMsg=e=>this.onMsg(e),this.net.onSnap=e=>this.onSnap(e),this.bindUI()}get inRoom(){return!!this.room&&this.myId>0}get me(){return this.room?.players.find(e=>e.id===this.myId)??null}get isHost(){return!!this.room&&this.room.hostId===this.myId}act(e){if(!this.configured){this.lastErr=Em,this.renderLobby(),this.ctx.toast(`⚠ Online server not hosted yet`);return}this.lastErr=``,this.renderLobby();let t=this.ctx.profile();this.net.profile={...t},this.net.status===`online`&&this.ready?this.net.send(e):(this.pendingAction=e,this.ready=!1,this.net.connect())}quick(e){this.act({t:`quick`,mode:e})}create(e){this.act({t:`create`,mode:e})}join(e){this.act({t:`join`,code:e})}leave(){this.net.send({t:`leave`}),this.net.disconnect(),this.cleanup(),this.ready=!1,this.ctx.setPhase(`lobby`)}startRace(){this.net.send({t:`start`})}setWaypoint(e=!1){let t=this.ctx.car().body.translation();this.net.send(e?{t:`wp`,clear:!0}:{t:`wp`,x:+t.x.toFixed(1),z:+t.z.toFixed(1)})}requestReset(){this.net.send({t:`reset`})}onMsg(e){switch(e.t){case`joined`:{let t=!this.inRoom||this.room?.id!==e.roomId;if(this.myId=e.id,this.room=e.room,this.lastTick=e.tick,t){this.cleanupWorld();let t=this.me;this.ctx.useCar(t.vehicle,t.paint),this.hist=[],this.visOff.set(0,0,0),this.visQ.identity(),this.ctx.setPhase(e.resumed?`playing`:`lobby`)}this.hist=[],this.synced=!1,this.pending=[],this.syncRoom(),this.ctx.toast(e.resumed?`Reconnected — same car, same room`:`Joined ${e.room.public?`public`:`private`} ${e.room.mode} room`);break}case`room`:{let t=this.room?.state;this.room=e.room,this.syncRoom(t);break}case`evt`:e.by!==this.myId&&this.ctx.toast(e.msg);break;case`err`:this.lastErr=e.msg,this.renderLobby(),this.ctx.toast(`⚠ `+e.msg);break;case`left`:this.cleanup();break;case`lost`:this.cleanup(),this.lastErr=e.kicked?`Disconnected by server: ${e.reason}`:`Connection lost — the server released your car`,this.ctx.setPhase(`lobby`),this.renderLobby()}}syncRoom(e){let t=this.room;if(!t)return;let n=new Set(t.players.map(e=>e.id));for(let[e,t]of this.remotes)(!n.has(e)||e===this.myId)&&this.removeRemote(e,t);for(let e of t.players){if(e.id===this.myId)continue;let n=this.remotes.get(e.id);n&&(n.vehicle!==e.vehicle||n.paint!==e.paint)&&(this.removeRemote(e.id,n),n=void 0),n||(n=this.addRemote(e.id,e.vehicle,e.paint)),n.name=e.name,n.away=e.away,n.tag.innerHTML=`${e.id===t.leaderId&&t.mode===`convoy`?`★ `:``}${xm(e.name)}${e.away?` <i>reconnecting…</i>`:``}`}t.mode===`race`&&!this.mworld&&(this.mworld=new Gp(this.ctx.scene,dm),this.mworld.setGateState(0)),t.mode!==`race`&&this.mworld&&(this.mworld.dispose(),this.mworld=null),this.updateWaypoint(),t.state===`countdown`&&e!==`countdown`&&(this.ctx.setPhase(`playing`),this.ctx.resetCamera()),t.state===`results`&&e===`racing`&&this.ctx.setPhase(`lobby`),this.renderLobby()}addRemote(e,t,n){let r=new Of(this.ctx.world,this.ctx.R,this.ctx.scene,bm,rp(t),n,0);r.body.setBodyType(this.ctx.R.RigidBodyType.KinematicPositionBased,!0);for(let e of[...r.headlights,r.beam])e.visible=!1;r.group.visible=!1;let i=document.createElement(`div`);i.className=`ptag`,ym(`tags`).appendChild(i);let a={id:e,v:r,buf:[],tag:i,last:null,name:``,away:!1,vehicle:t,paint:n,vis:{p:new K,q:new Be,speed:0}};return this.remotes.set(e,a),a}removeRemote(e,t){t.v.dispose(),t.tag.remove(),this.remotes.delete(e)}cleanupWorld(){for(let[e,t]of this.remotes)this.removeRemote(e,t);this.mworld?.dispose(),this.mworld=null,this.wpMesh&&(this.ctx.scene.remove(this.wpMesh),this.wpMesh.geometry.dispose(),this.wpMesh.material.dispose(),this.wpMesh=null)}cleanup(){let e=this.inRoom;this.cleanupWorld(),this.room=null,this.myId=0,this.hist=[],this.synced=!1,this.pending=[],this.offset=null,this.pilot=null,this.visOff.set(0,0,0),this.visQ.identity(),e&&this.ctx.restoreCar(),ym(`ohud`).classList.add(`hidden`),ym(`countdown`).classList.add(`hidden`),this.renderLobby()}updateWaypoint(){let e=this.room?.mode===`convoy`?this.room.waypoint:null;if(!e)this.wpMesh&&(this.wpMesh.visible=!1);else{if(!this.wpMesh){let e=new $r(.9,.9,40,12,1,!0);e.translate(0,20,0),this.wpMesh=new lr(e,new Zn({color:16756794,transparent:!0,opacity:.45,depthWrite:!1,side:2})),this.wpMesh.name=`waypoint`,this.ctx.scene.add(this.wpMesh)}this.wpMesh.visible=!0,this.wpMesh.position.set(e.x,wd(e.x,e.z),e.z)}}get frozen(){let e=this.room;if(!e||this.net.status!==`online`||e.state===`countdown`)return!0;if(e.state===`racing`){let t=e.race?.players.find(e=>e.id===this.myId);if(t&&t.time!==null)return!0}return!1}frame(e,t){if(!this.inRoom)return;let n=this.ctx.car(),r=this.ctx.world;if(!this.synced){this.acc=0;return}this.acc+=e;let i=0;for(;this.acc>=.016666666666666666&&i<30;){let e=this.pilot?this.pilotInput():t;this.frozen&&(e=um),this.seq++,n.step(lm,e),r.step(),this.hist.push({s:this.seq,inp:e,st:pm(n)}),this.pending.push(fm(e)),this.acc-=lm,i++}i>=30&&(this.acc=0),this.hist.length>900&&this.hist.splice(0,this.hist.length-900);let a=performance.now();if(this.pending.length>=2||this.pending.length&&a-this.lastFlush>45){if(this.net.status===`online`)for(;this.pending.length;){let e=this.pending.splice(0,40);this.net.send({t:`i`,s:this.seq-this.pending.length-e.length+1,a:e})}this.pending=[],this.lastFlush=a}}onSnap(e){let t=gm(e);if(!t||!this.inRoom)return;this.metrics.snaps++;let n=performance.now()/1e3,r=t.tick/30-n;(this.offset===null||r>this.offset)&&(this.offset=r),this.jitter=this.jitter*.95+(this.offset-r)*.05,this.interpDelay=Math.min(.35,Math.max(.07,1.5/30+2.5*this.jitter)),this.lastTick=t.tick;for(let e of t.players){if(e.id===this.myId){if(!this.synced){mm(this.ctx.car(),e),this.hist=[],this.synced=!0,this.ctx.resetCamera(),this.lastAck=t.ack;continue}this.reconcile(t.ack,e);continue}let n=this.remotes.get(e.id);if(!n)continue;let r=t.tick/30;n.buf.length&&n.buf[n.buf.length-1].t>=r||(n.buf.push({t:r,s:e}),n.buf.length>60&&n.buf.shift())}}reconcile(e,t){this.lastAck=e;let n=this.ctx.car(),r=this.ctx.world;for(;this.hist.length&&this.hist[0].s<e;)this.hist.shift();let i=this.hist.length&&this.hist[0].s===e?this.hist[0]:null;if(!i&&!this.hist.length){mm(n,t);return}if(!i&&this.hist.length&&e<this.hist[0].s){this.metrics.waiting++;return}let a=1/0;if(i){a=Math.hypot(i.st.p[0]-t.p[0],i.st.p[1]-t.p[1],i.st.p[2]-t.p[2]);let e=Math.abs(i.st.q[0]*t.q[0]+i.st.q[1]*t.q[1]+i.st.q[2]*t.q[2]+i.st.q[3]*t.q[3]),n=2*Math.acos(Math.min(1,e)),r=Math.hypot(i.st.lv[0]-t.lv[0],i.st.lv[1]-t.lv[1],i.st.lv[2]-t.lv[2]);if(this.metrics.errs.push(a),this.metrics.errs.length>2e3&&this.metrics.errs.shift(),a<.03&&n<.02&&r<.15)return}let o=n.body.translation(),s=n.body.rotation(),c=new K(o.x,o.y,o.z),l=new Be(s.x,s.y,s.z,s.w);mm(n,t);for(let t of this.hist)t.s<=e||(n.step(lm,t.inp),r.step(),t.st=pm(n),this.metrics.replaySteps++);i&&(i.st=t);let u=n.body.translation(),d=n.body.rotation(),f=c.distanceTo(new K(u.x,u.y,u.z));!i||f>4?(this.metrics.hardSnaps++,i?this.metrics.bigJump++:(this.metrics.noHist++,this.metrics.nhLog.push([e,this.seq,this.hist.length,this.hist[0]?.s??-1]),this.metrics.nhLog.length>8&&this.metrics.nhLog.shift()),this.visOff.set(0,0,0),this.visQ.identity(),f>4&&this.ctx.resetCamera()):(this.metrics.corrections++,this.metrics.maxErr=Math.max(this.metrics.maxErr,a),this.metrics.corrErrs.push(a),this.metrics.corrErrs.length>2e3&&this.metrics.corrErrs.shift(),this.visOff.add(c.sub(new K(u.x,u.y,u.z))),this.visQ.premultiply(l.multiply(new Be(d.x,d.y,d.z,d.w).invert())),this.metrics.maxVisOff=Math.max(this.metrics.maxVisOff,this.visOff.length()))}afterSync(e){if(!this.inRoom)return;let t=this.ctx.car(),n=Math.exp(-e*12);if(this.visOff.multiplyScalar(n),this.visQ.slerp(new Be,1-n),t.group.position.add(this.visOff),t.group.quaternion.premultiply(this.visQ),this.lastOwn&&e>0&&e<.1){let n=t.body.linvel();this.metrics.ownJerk.push(Math.abs(this.lastOwn.distanceTo(t.group.position)-Math.hypot(n.x,n.y,n.z)*e)),this.metrics.ownJerk.length>3e3&&this.metrics.ownJerk.shift()}(this.lastOwn??(this.lastOwn=new K)).copy(t.group.position),this.offset!==null&&(this.offset-=e*.002);let r=performance.now()/1e3+(this.offset??0)-this.interpDelay,i=this.ctx.camera,a=window.innerWidth,o=window.innerHeight,s=new K;for(let t of this.remotes.values()){let n=t.buf;if(!n.length)continue;let c,l,u,d,f;if(r<=n[0].t||n.length===1){let e=n[0].s;c=new K(...e.p),l=new Be(...e.q),u=e.steer,d=e.susp,f=Math.hypot(e.lv[0],e.lv[2])}else if(r>=n[n.length-1].t){let e=n[n.length-1].s,t=Math.min(.12,r-n[n.length-1].t);this.metrics.extrap++,c=new K(e.p[0]+e.lv[0]*t,e.p[1]+e.lv[1]*t,e.p[2]+e.lv[2]*t),l=new Be(...e.q),u=e.steer,d=e.susp,f=Math.hypot(e.lv[0],e.lv[2])}else{let e=n.length-2;for(;e>0&&n[e].t>r;)e--;let t=n[e],i=n[e+1],a=(r-t.t)/(i.t-t.t||1);for(c=new K(...t.s.p).lerp(new K(...i.s.p),a),l=new Be(...t.s.q).slerp(new Be(...i.s.q),a),u=t.s.steer+(i.s.steer-t.s.steer)*a,d=t.s.susp.map((e,t)=>e+(i.s.susp[t]-e)*a),f=Math.hypot(t.s.lv[0]+(i.s.lv[0]-t.s.lv[0])*a,t.s.lv[2]+(i.s.lv[2]-t.s.lv[2])*a);n.length>3&&n[1].t<r-.5;)n.shift()}t.last&&e>0&&e<.1&&(this.metrics.remoteJerk.push(Math.abs(t.last.distanceTo(c)-f*e)),this.metrics.remoteJerk.length>3e3&&this.metrics.remoteJerk.shift()),(t.last??(t.last=new K)).copy(c),t.v.group.visible=!0,t.v.syncRemote(c,l,u,d,f,e),t.vis.p.copy(c),t.vis.q.copy(l),t.vis.speed=f,t.v.body.setNextKinematicTranslation(c),t.v.body.setNextKinematicRotation(l),s.set(c.x,c.y+2.5,c.z).project(i);let p=s.z<1&&i.position.distanceTo(c)<160&&this.ctx.phase()!==`menu`;t.tag.style.display=p?``:`none`,p&&(t.tag.style.transform=`translate(${((s.x+1)/2*a).toFixed(1)}px, ${((1-s.y)/2*o).toFixed(1)}px) translate(-50%, -100%)`)}this.hudT-=e,this.hudT<=0&&(this.hudT=.1,this.renderHud())}estTick(){return this.offset===null?this.lastTick:(performance.now()/1e3+this.offset)*30}renderHud(){let e=this.room,t=this.inRoom&&this.ctx.phase()===`playing`;if(ym(`ohud`).classList.toggle(`hidden`,!t),!t||!e)return;let n=this.ctx.car().body.translation(),r=this.ctx.camera,i=new K;r.getWorldDirection(i),ym(`oh-title`).textContent=`${e.mode===`race`?`Online race`:`Convoy`} · ${e.public?`public`:`room `+e.code} · ${e.players.length}/${e.max}`;let a=``,o=``,s=null,c=ym(`countdown`);if(e.mode===`race`){let t=e.race?.players.find(e=>e.id===this.myId),n=e.race?.startTick??0,r=(this.estTick()-n)/30;e.state===`countdown`?(a=`0:00.00`,o=`Get ready`,c.classList.remove(`hidden`),c.textContent=String(Math.max(1,Math.ceil(-r)))):e.state===`racing`&&t?(a=t.time===null?Sm(Math.max(0,r)):Sm(t.time),o=t.time===null?`CP ${t.next+1}/${dm.gates.length}`:`Finished #${t.place}`,t.time===null&&t.next<dm.gates.length&&(s=dm.gates[t.next]),this.mworld?.setGateState(t.next),r<.8?(c.classList.remove(`hidden`),c.textContent=`GO!`):c.classList.add(`hidden`)):(c.classList.add(`hidden`),a=e.state===`racing`?`Race in progress`:e.state===`results`?`Race over`:`Grid`,o=this.isHost?`Esc → lobby → Start race`:`Waiting for the host to start`,s=dm.start)}else{c.classList.add(`hidden`);let t=e.players.find(t=>t.id===e.leaderId),n=this.remotes.get(e.leaderId);a=this.isHost?`★ You lead the convoy`:`Following ★ ${t?.name??`—`}`,e.waypoint?(s=e.waypoint,o=`Waypoint`):n?(s={x:n.vis.p.x,z:n.vis.p.z},o=`Leader`):o=this.isHost?`G = mark a waypoint for everyone`:``}if(ym(`oh-main`).textContent=a,s){let e=Math.atan2(s.x-n.x,s.z-n.z)-Math.atan2(i.x,i.z),t=Math.atan2(Math.sin(e),Math.cos(e));ym(`oh-arrow`).style.transform=`rotate(${(-t).toFixed(3)}rad)`,ym(`oh-arrow`).style.visibility=``,ym(`oh-dist`).textContent=`${Math.hypot(s.x-n.x,s.z-n.z).toFixed(0)} m`}else ym(`oh-arrow`).style.visibility=`hidden`,ym(`oh-dist`).textContent=``;ym(`oh-sub`).textContent=o,ym(`btn-wp`).classList.toggle(`hidden`,!(e.mode===`convoy`&&this.isHost)),this.renderStatus()}renderStatus(){let e=this.net.status,t=ym(`oh-net`);t.textContent=e===`online`?`● ${Math.round(this.net.rtt)} ms`:e===`reconnecting`?`◌ Reconnecting…`:e===`connecting`?`◌ Connecting…`:`○ Offline`,t.className=`chip net `+e}setPilot(e){if(!e){this.pilot=null;return}let t=e.route===`race`?[dm.start,...dm.gates.map(e=>({x:e.x+Math.sin(e.yaw)*4,z:e.z+Math.cos(e.yaw)*4}))]:[...ad,ad[0]].map(([e,t])=>({x:e,z:t}));this.pilot={throttle:e.throttle??1,route:t.map(e=>({x:e.x,z:e.z})),prog:0}}pilotInput(){let e=this.pilot,t=this.ctx.car(),n=t.body.translation(),r=t.forward(),i=Math.atan2(r.x,r.z),a=t.forwardSpeed(),o=e.route;for(;e.prog<o.length-2&&Math.hypot(o[e.prog+1].x-n.x,o[e.prog+1].z-n.z)<Math.hypot(o[e.prog].x-n.x,o[e.prog].z-n.z)+2;)e.prog++;let s=7+Math.abs(a)*.5,c=e.prog,l=n.x,u=n.z;for(;c<o.length-1;){let e=Math.hypot(o[c+1].x-l,o[c+1].z-u);if(e>s)break;s-=e,l=o[c+1].x,u=o[c+1].z,c++}let d=o[Math.min(o.length-1,c+1)].x,f=o[Math.min(o.length-1,c+1)].z,p=Math.hypot(d-l,f-u)||1;d=l+(d-l)/p*Math.min(s,p),f=u+(f-u)/p*Math.min(s,p);let m=Math.atan2(d-n.x,f-n.z)-i;m=Math.atan2(Math.sin(m),Math.cos(m));let h=o[Math.min(o.length-1,e.prog+1)],g=o[Math.min(o.length-1,e.prog+2)],_=o[e.prog],v=Math.abs(Math.atan2(Math.sin(Math.atan2(g.x-h.x,g.z-h.z)-Math.atan2(h.x-_.x,h.z-_.z)),Math.cos(Math.atan2(g.x-h.x,g.z-h.z)-Math.atan2(h.x-_.x,h.z-_.z)))),y=Math.max(7,24-v*16)*(.6+.4*e.throttle);return{throttle:a<y?e.throttle:0,brake:a>y+2.5?.6:0,steer:Math.max(-1,Math.min(1,m*2.2)),handbrake:!1}}bindUI(){let e=ym(`lb-name`);e.addEventListener(`change`,()=>{this.ctx.setName(e.value)}),document.querySelectorAll(`[data-quick]`).forEach(t=>t.onclick=()=>{this.ctx.setName(e.value),this.quick(t.dataset.quick)}),ym(`lb-create`).onclick=()=>{this.ctx.setName(e.value),this.create(ym(`lb-mode`).value)},ym(`lb-join`).onclick=()=>{this.ctx.setName(e.value),this.join(ym(`lb-code`).value)},ym(`lb-code`).addEventListener(`keydown`,e=>{e.key===`Enter`&&ym(`lb-join`).click()}),ym(`lb-leave`).onclick=()=>this.leave(),ym(`lb-start`).onclick=()=>this.startRace(),ym(`lb-drive`).onclick=()=>{this.ctx.setPhase(`playing`),this.ctx.resetCamera()},ym(`lb-copy`).onclick=()=>{let e=this.room?.code;e&&navigator.clipboard?.writeText(e).then(()=>this.ctx.toast(`Code copied`),()=>this.ctx.toast(e))},ym(`btn-wp`).onclick=()=>this.setWaypoint(!!this.room?.waypoint&&Math.hypot(this.room.waypoint.x-this.ctx.car().body.translation().x,this.room.waypoint.z-this.ctx.car().body.translation().z)<10)}renderLobby(){let e=this.room,t=this.net.status,n=this.ctx.profile(),r=ym(`net-status`);r.textContent=Tm[t]+(t===`online`&&this.net.rtt?` · ${Math.round(this.net.rtt)} ms`:``),r.className=`net-chip `+t,ym(`lb-setup`).classList.toggle(`hidden`,!!e),ym(`lb-room`).classList.toggle(`hidden`,!e),ym(`lb-err`).textContent=this.lastErr,ym(`lb-nohost`).classList.toggle(`hidden`,this.configured),this.configured||(r.textContent=`Server not hosted`,r.className=`net-chip offline`),ym(`lb-backrow`).classList.toggle(`hidden`,!!e),ym(`lb-veh`).textContent=`${Cm(n.vehicle)} · ${wm(n.paint)} — stock specs online (fair play)`;let i=ym(`lb-name`);document.activeElement!==i&&(i.value=n.name);let a=t===`connecting`||t===`reconnecting`&&!e;if(document.querySelectorAll(`#lb-setup button`).forEach(e=>e.disabled=a),!e)return;ym(`lb-roomkind`).textContent=`${e.public?`Public`:`Private`} ${e.mode===`race`?`race (Canyon Dash, 13 CP)`:`convoy · free roam`}`,ym(`lb-code-big`).textContent=e.code??``,ym(`lb-codebox`).classList.toggle(`hidden`,!e.code),ym(`lb-players`).innerHTML=e.players.map(t=>`<li class="${t.id===this.myId?`me`:``}"><span class="sw" style="background:#${t.paint.toString(16).padStart(6,`0`)}"></span><b>${xm(t.name)}${t.id===this.myId?` (you)`:``}</b><em>${Cm(t.vehicle)}</em><span class="tags">${t.id===e.hostId?e.mode===`convoy`?`★ leader`:`host`:``}${t.away?` · reconnecting…`:``}</span><span class="ping">${t.away?`—`:t.ping?t.ping+` ms`:``}</span></li>`).join(``),ym(`lb-count`).textContent=`${e.players.length}/${e.max} players · ${e.state===`free`?`driving`:e.state}`;let o=e.race?.results;ym(`lb-results`).innerHTML=e.mode===`race`&&o?`<h3>Race results <small>(decided by the server)</small></h3><ol>${o.map(e=>`<li class="${e.id===this.myId?`me`:``}"><b>${e.place?`#`+e.place:`DNF`}</b><span>${xm(e.name)}</span><em>${e.time===null?`—`:Sm(e.time)}</em></li>`).join(``)}</ol>`:``;let s=ym(`lb-start`);s.classList.toggle(`hidden`,e.mode!==`race`),s.disabled=!this.isHost||e.state!==`lobby`&&e.state!==`results`,s.textContent=e.state===`results`?`Race again`:`Start race`,s.title=this.isHost?``:`Only the host can start`}},Om=[{r:.8,hMin:18,hMax:62,seed:3.1,haze:.42},{r:.95,hMin:34,hMax:112,seed:7.7,haze:.66}];function km(e,t){let n=0,r=1,i=0;for(let a=0;a<5;a++){let o=[3,7,13,23,41][a];n+=r*(.5+.5*Math.sin(e*o+t*(a+1.3)+Math.sin(e*o*.5+t)*.8)),i+=r,r*=.55}return(n/i)**1.6}function Am(e){let t=new Ft;t.name=`backdrop:ridges`;let n=[];for(let e of Om){let r=[],i=[],a=[];for(let t=0;t<=360;t++){let n=t/360*Math.PI*2,o=e.hMin+(e.hMax-e.hMin)*km(n,e.seed),s=Math.sin(n)*e.r,c=Math.cos(n)*e.r;if(r.push(s,-40,c,s,o,c),i.push(0,1),t<360){let e=t*2;a.push(e,e+1,e+2,e+1,e+3,e+2)}}let o=new zn;o.setAttribute(`position`,new Dn(r,3)),o.setAttribute(`aTop`,new Dn(i,1)),o.setIndex(a);let s=new Ra({uniforms:{uRock:{value:new X},uHaze:{value:new X},uK:{value:e.haze}},vertexShader:`attribute float aTop; varying float vT; varying float vY; void main(){ vT = aTop; vY = position.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform vec3 uRock; uniform vec3 uHaze; uniform float uK; varying float vT; varying float vY;
        void main(){ float base = smoothstep(-10.0, 40.0, vY); vec3 c = mix(uHaze, uRock, (1.0 - uK) * base); gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,side:2,fog:!1,depthWrite:!0});n.push(s);let c=new lr(o,s);c.frustumCulled=!1,c.renderOrder=-1,c.name=`backdrop:layer`,t.add(c)}return e.add(t),{group:t,setColors(e,t){for(let r of n)r.uniforms.uRock.value.copy(e),r.uniforms.uHaze.value.copy(t)},update(e,n){let r=e.far*.9;t.position.set(e.position.x,n,e.position.z),t.scale.set(r,1,r)}}}var jm=(e,t)=>Math.atan2(e,t);function Mm(e,t){return e.map(([n,r],i)=>{let a=e[Math.max(0,i-1)],o=e[Math.min(e.length-1,i+1)];return{x:n,z:r,yaw:jm(o[0]-a[0],o[1]-a[1]),w:t}})}var Nm=(e,t)=>({...Vp(e),...t}),Pm=cd,Fm={x:0,z:-8,yaw:jm(14,-6)},Im=ld,Lm={id:`lv1-desert-training`,mode:`race`,type:`trail`,title:`Desert Training`,desc:`Learn the basics on an easy sand trail: drive through the 13 flag gates and stop inside the finish circle.`,start:Fm,gates:Mm(Pm,16),limit:90,zone:Im,weather:`clear`,path:[{x:Fm.x,z:Fm.z},...Pm.map(([e,t])=>({x:e,z:t})),{x:Im.x,z:Im.z}],targets:{gold:28.5,silver:35.5,bronze:47.5},reward:200,tips:{[-1]:`Accelerate and steer through the flag gates`,0:`Good! Follow the flags towards the desert`,1:`Soft sand ahead — keep your momentum`,2:`Feather the throttle if the wheels start to spin`,3:`Dunes slow you down: take the gentle line`,4:`Brake early (S / ↓ or left half) before the turns`,6:`Into the dune field — climb straight, not across the slope`,8:`Use the handbrake (Space / HB) for a tight turn`,10:`Halfway — keep a steady line`,11:`Almost there — the finish flag is past the last gate`,12:`Now stop inside the finish circle`}},Rm=Nm(`race-loop`,{id:`lv2-dune-challenge`,title:`Sand Dune Challenge`,weather:`sunset`,limit:120,desc:`Two laps through the dunes at sunset. 16 checkpoints, wrong-way and missed-gate warnings, 2:00 limit.`,tips:{[-1]:`Two laps — hit every checkpoint in order`},reward:360}),zm=Nm(`ch-mud`,{id:`lv3-mud-jungle`,title:`Mud Jungle`,weather:`fog`,limit:45,noReset:!1,maxResets:3,stuckFail:15,desc:`Cross the jungle mud basin in thick fog. Puddles and deep mud: keep moving — stuck for 15 s fails the run. 3 recoveries.`,tips:{[-1]:`Fog ahead — follow the gate lights. Keep moving in the mud!`},reward:380}),Bm=Nm(`ch-climb`,{id:`lv4-rocky-mountain`,title:`Rocky Mountain`,maxResets:3,reward:450,tips:{[-1]:`Steep loose rock: low speed, steady throttle. Do not roll over.`}}),Vm=Nm(`race-dash`,{id:`lv5-night-expedition`,title:`Night Expedition`,weather:`night`,limit:150,maxResets:5,reward:500,desc:`Navigate 13 checkpoints across the desert and canyon rim at night by headlight and the HUD arrow.`,tips:{[-1]:`Night run: follow the arrow and the amber gate lights`}}),Hm=[Lm,Rm,zm,Bm,Vm],Um=e=>Vp(e)??Hm.find(t=>t.id===e),Wm=[{n:1,id:`L1`,title:`Desert Training`,difficulty:`Easy`,status:`playable`,missionId:Lm.id,objective:`Follow the flag trail into the desert and stop in the finish circle.`,unlock:`Unlocks Level 2`},{n:2,id:`L2`,title:`Sand Dune Challenge`,difficulty:`Easy`,status:`playable`,missionId:Rm.id,objective:`Two laps of the dunes at sunset within 2:00.`,unlock:`Unlocks Level 3`},{n:3,id:`L3`,title:`Mud Jungle`,difficulty:`Medium`,status:`prototype`,missionId:zm.id,objective:`Cross the jungle mud basin in fog without getting stuck.`,note:`Prototype: uses the Mud Crossing route; a longer jungle trail is planned.`},{n:4,id:`L4`,title:`Rocky Mountain`,difficulty:`Medium`,status:`prototype`,missionId:Bm.id,objective:`Climb the switchback trail to the summit without rolling over.`,note:`Prototype: uses the Ridge Climb route.`},{n:5,id:`L5`,title:`Night Expedition`,difficulty:`Hard`,status:`prototype`,missionId:Vm.id,objective:`Navigate 13 checkpoints at night by headlight.`,note:`Prototype: uses the Canyon Dash route at night.`},{n:6,id:`L6`,title:`River Crossing`,difficulty:`Hard`,status:`planned`,missionId:null,objective:`Ford a river with slippery banks and recover the vehicle.`,note:`Not built yet: needs a river with water physics and banks.`},{n:7,id:`L7`,title:`Extreme Off-Road`,difficulty:`Expert`,status:`planned`,missionId:null,objective:`Mixed terrain, changing weather, limited recoveries.`,note:`Not built yet.`},{n:8,id:`L8`,title:`Online Convoy Expedition`,difficulty:`Medium`,status:`online`,missionId:null,objective:`Drive a convoy route together with other players.`,note:`Needs the online server to be hosted.`},{n:9,id:`L9`,title:`Competitive Off-Road Race`,difficulty:`Hard`,status:`online`,missionId:null,objective:`Race other players: positions and leaderboard.`,note:`Needs the online server to be hosted.`},{n:10,id:`L10`,title:`Ultimate Expedition`,difficulty:`Extreme`,status:`planned`,missionId:null,objective:`A long expedition across a large combined map.`,note:`Not built yet: needs the larger map.`}],Gm=(e,t)=>!!(t.missionId&&e[t.missionId]);function Km(e,t,n=!1){return n||t.n===1?!0:t.status!==`planned`&&Wm.filter(e=>e.n<t.n&&e.status!==`online`&&e.status!==`planned`).every(t=>Gm(e,t))}var qm=e=>Wm.find(t=>t.missionId===e)??null,$=e=>document.getElementById(e),Jm=()=>new Promise(e=>requestAnimationFrame(()=>e(null))),Ym=new X(14860938),Xm=new K,Zm=new K,Qm={throttle:0,brake:0,steer:0,handbrake:!0},$m=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};async function eh(e,t){let n=Sp(),r=tm();im(r,n.vehicle)||(n.vehicle=`scout`);let i=e=>sm(rp(e),om(r,e)),a=new fp;a.setVolume(n.volume,n.muted),t(45,`Sculpting terrain…`),await Jm();let o=$(`game`),s,c=null,l=new Wt,u=new X;l.background=u,l.fog=new Ut(u,40,300);let d=new wo(62,1,.1,900),f=new fo(14674175,5916208,1.1),p=new jo(16769720,2.6);p.shadow.camera.left=-40,p.shadow.camera.right=40,p.shadow.camera.top=40,p.shadow.camera.bottom=-40,p.shadow.camera.near=1,p.shadow.camera.far=260,p.shadow.bias=-5e-4,p.shadow.normalBias=.04,l.add(f,p,p.target);let m=new Ra({side:1,depthWrite:!1,fog:!1,uniforms:{top:{value:new X},bottom:{value:new X},sunDir:{value:new K(0,1,0)},sunCol:{value:new X},uCloud:{value:.5},uCloudCol:{value:new X(1,1,1)},uTime:vu.uTime},vertexShader:`varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; uniform float uCloud; uniform vec3 uCloudCol; uniform float uTime; varying vec3 vP;
      ${gu}
      void main(){ vec3 d = normalize(vP); float t = smoothstep(-0.02, 0.45, d.y); vec3 c = mix(bottom, top, t);
        float s = max(0.0, dot(d, normalize(sunDir))); c += sunCol * (pow(s, 600.0) * 3.0 + pow(s, 12.0) * 0.25);
        // drifting cloud layer projected on a dome; lit edge towards the sun
        vec2 cu = d.xz / (d.y + 0.12) * 1.6 + vec2(uTime * 0.004, uTime * 0.002);
        float cn = owFB(cu * 1.3) * 0.75 + owFB(cu * 4.0 + 2.0) * 0.25;
        float cov = smoothstep(1.0 - uCloud * 0.75, 1.05 - uCloud * 0.45, cn) * smoothstep(0.0, 0.18, d.y);
        vec3 cc = uCloudCol * (0.82 + 0.3 * cn) + sunCol * pow(s, 6.0) * 0.35;
        c = mix(c, cc, cov * 0.92);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`}),h=new lr(new Ea(600,24,12),m);l.add(h);let g=_p(l),_=new Oo(14673663,0,11,1.6),v=new Oo(10467583,0,10,1.6),y=!0,b=new Eo(16770760,0,30,.6,.5,1.2),x=new Eo(11061503,0,30,.7,.6,1.2);l.add(_,v,b,b.target,x,x.target);let S=new e.World({x:0,y:-9.81,z:0});S.timestep=1/60,$d(l,S,e),t(70,`Fuelling the 4×4…`),await Jm();let C=new jf(l),w=e=>n.paints[e]??rp(e).defaultPaint,T=e=>e===`low`?0:1;Of.defaultProfile=n.profile??`pro`;let E=new Of(S,e,l,C,i(n.vehicle),w(n.vehicle),T(n.preset)),D=null,O={x:0,z:-8,yaw:Math.atan2(Uu.sand.x-0,Uu.sand.z+8)},ee=null,k=null,A=(e=O.x,t=O.z,n=O.yaw)=>{E.reset(e,wd(e,t)+E.spawnLift,t,n),ee?.(),k?.()};A();let j=new pp(l,1800,9.8,.6,.95),te=new pp(l,1400,-.3,1.3,.34),M=new pp(l,1e3,9.8,.4,.75),N=new pp(l,600,.35,.05,.22),P=[j,te,M,N],ne=Am(l),ie=0,ae=new mp(l,5e3);t(85,`Checking the weather…`);let F=n.weather,oe=new K,se=new Wt;se.add(new lr(h.geometry,m));let ce=null,le=null,ue=``;function de(){!ce||le&&ue===F||(ue=F,le?.dispose(),le=ce.fromScene(se,0,1,1e3),Rd.envMap=le.texture,Rd.needsUpdate=!0)}function fe(e){let t=c===null?null:s;if(t){let e=document.createElement(`canvas`);e.id=`game`,e.setAttribute(`aria-label`,`Game view`),o.replaceWith(e),o=e;for(let e of[p,E.beam])e.shadow.map?.dispose(),e.shadow.map=null;t.dispose(),t.forceContextLoss()}s=new pu({canvas:o,antialias:e,powerPreference:`high-performance`}),s.outputColorSpace=re,s.toneMapping=4,s.shadowMap.type=1,c=e,er(o),D?.dispose();let n=new bs(s);D=n.fromScene(new mu,.04).texture,n.dispose(),E.setEnv(D,1),ce?.dispose(),ce=new bs(s),le=null}let pe=e=>{let t=wp[e];c!==t.aa&&fe(t.aa),E.lod!==T(e)&&E.rebuildVisual(T(e)),s.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatio)),s.shadowMap.enabled=t.shadows,p.castShadow=t.shadows,p.shadow.mapSize.x!==t.shadowSize&&(p.shadow.mapSize.set(t.shadowSize,t.shadowSize),p.shadow.map?.dispose(),p.shadow.map=null);for(let e of P)e.budget=t.particles;rf(e===`low`?0:e===`medium`?1:2),Pu(e===`low`?0:e===`medium`?1:2),bu(zd,e!==`low`),ae.setDensity(t.rain),$(`preset-note`).textContent=e===`low`?`No shadows, no anti-aliasing, fewer particles — best for older phones.`:e===`medium`?`Shadows, anti-aliasing, balanced resolution and particles.`:`Full resolution, high-res shadows, max particles.`,me(F),L()};function me(e){F=e;let t=gp[e],r=wp[n.preset];m.uniforms.top.value.set(t.skyTop),m.uniforms.bottom.value.set(t.skyBottom),u.set(t.fog);let i=l.fog;i.color.set(t.fog),i.near=t.fogNear,i.far=Math.min(t.fogFar,r.fogFar),d.far=Math.max(120,i.far+300),d.updateProjectionMatrix(),p.color.set(t.sun),p.intensity=t.sunI,oe.set(...t.sunDir).normalize(),m.uniforms.sunDir.value.copy(oe),m.uniforms.sunCol.value.set(e===`fog`||e===`rain`?0:t.sun),f.color.set(t.hemiSky),f.groundColor.set(t.hemiGround),f.intensity=t.hemiI,s.toneMappingExposure=t.exposure,g.visible=t.stars,ae.mesh.visible=t.rain;for(let e of Ld)e.roughness=t.wet?.45:.95,e.metalness=t.wet?.08:0,e.color.set(t.wet?11053224:16777215);E.paint.roughness=t.wet?.15:.45,Rd.color.set(2827290).lerp(new X(t.fog),.12),vu.uWetAll.value=+!!t.wet,vu.uSkyRefl.value.set(t.skyBottom).lerp(new X(t.skyTop),.35),m.uniforms.uCloud.value=t.cloud,m.uniforms.uCloudCol.value.set(t.cloudCol);{let n=new X(t.fog).lerp(new X(t.skyBottom),.5),r=new X(7300183).multiply(new X(t.hemiSky)).lerp(n,.2);e===`night`&&r.multiplyScalar(.35),ne.setColors(r,n)}de();for(let e of P)e.uniforms.uTint.value.set(t.tint);let a=e===`night`;for(let e of E.headlights)e.intensity=t.headlights&&n.preset!==`low`?a?90:45:0;E.beam.intensity=t.headlights?a?320:160:0;let o=t.headlights&&r.beamShadow&&r.shadows&&(a||e===`fog`);E.beam.castShadow!==o&&(E.beam.castShadow=o,E.beam.shadow.map?.dispose(),E.beam.shadow.map=null),E.lampMat.emissiveIntensity=t.headlights?5:1.5,E.lightsOn=!!t.headlights,l.traverse(e=>{let t=e.material;t&&!Array.isArray(t)&&(t.needsUpdate=!0)}),$(`btn-weather`).textContent=t.icon,document.querySelectorAll(`#seg-weather button`).forEach(t=>t.classList.toggle(`on`,t.dataset.v===e))}let he=()=>n.touch===`on`||n.touch===`auto`&&xp(),I=62;function L(){let e=window.innerWidth,t=window.innerHeight;s.setSize(e,t,!1),d.aspect=e/t,I=e/t<1?72:62,d.updateProjectionMatrix();let n=document.activeElement,r=!!n&&(n.tagName===`TEXTAREA`||n.tagName===`INPUT`&&/^(text|search|email|number|tel|url|password|)$/.test(n.type)),i=window.visualViewport,a=i&&r?Math.max(0,t-i.height-i.offsetTop):0;document.documentElement.style.setProperty(`--kb`,`${Math.round(a)}px`),document.body.classList.toggle(`kb`,a>80),a>80&&document.activeElement?.scrollIntoView?.({block:`nearest`})}window.addEventListener(`resize`,L),window.addEventListener(`orientationchange`,()=>setTimeout(L,150)),window.visualViewport?.addEventListener(`resize`,L),document.addEventListener(`focusout`,()=>setTimeout(L,50));let R=new dp;R.scheme=n.controls,R.autoThrottle=n.autoThrottle,R.bindZones($(`tzones`),(e,t)=>{$(`tzones`).querySelector(`.tz.l`).classList.toggle(`on`,e),$(`tzones`).querySelector(`.tz.r`).classList.toggle(`on`,t)}),R.bindHold($(`tp-hb`),`hand`),R.bindHold($(`tp-brake`),`brake`),$(`tp-rec`).addEventListener(`pointerdown`,e=>{e.stopPropagation(),R.onReset?.()}),$(`tp-cal`).addEventListener(`pointerdown`,e=>{e.stopPropagation(),R.calibrateTilt(),je(`Tilt centred`)}),R.wheelSens=n.wheelSens;let ge=$(`wheel`).querySelector(`.w-turn`);R.onWheel=e=>{ge.style.transform=`rotate(${e.toFixed(1)}deg)`},R.bindWheel($(`wheel`)),R.bindHold($(`sb-l`),`left`),R.bindHold($(`sb-r`),`right`),R.bindHold($(`pd-gas`),`gas`),R.bindHold($(`pd-brake`),`brake`),R.bindHold($(`ck-hb`),`hand`),$(`ck-rec`).addEventListener(`pointerdown`,e=>{e.stopPropagation(),R.onReset?.()}),$(`ck-cal`).addEventListener(`pointerdown`,e=>{e.stopPropagation(),R.calibrateTilt(),je(`Tilt centred`)});let _e=e=>{$(`drv-note`).textContent=e},ve=e=>{let t=E.setGear(e);return t.ok?_e(``):(je(`⛔ `+t.msg),_e(t.msg)),be(),t},ye=e=>{let t=E.setTransfer(e);return t.ok?(_e(e===`4L`?`Low range: x`+Ef+` torque, top speed / `+Ef:``),je(e+(e===`4L`?` · low range`:e===`2H`?` · rear-wheel drive`:` · four-wheel drive`))):(je(`⛔ `+t.msg),_e(t.msg)),be(),t},be=()=>{$(`drv-gear`).textContent=E.sel===`A`?`A`:E.sel,$(`drv-mode`).textContent=E.transfer,document.querySelectorAll(`#drv-sel button`).forEach(e=>e.classList.toggle(`on`,e.dataset.g===E.sel)),document.querySelectorAll(`#drv-tc button`).forEach(e=>{let t=e.dataset.t;e.classList.toggle(`on`,t===E.transfer),e.disabled=!E.driveModes.includes(t),e.hidden=t===`AWD`?!E.driveModes.includes(`AWD`):E.driveModes.length===1&&E.driveModes[0]===`AWD`})};$(`drv-chip`).onclick=()=>{let e=$(`drv-pop`),t=e.classList.contains(`hidden`);e.classList.toggle(`hidden`,!t),$(`drv-chip`).setAttribute(`aria-expanded`,String(t)),be()},document.querySelectorAll(`#drv-sel button`).forEach(e=>e.onclick=()=>ve(e.dataset.g)),document.querySelectorAll(`#drv-tc button`).forEach(e=>e.onclick=()=>ye(e.dataset.t));let xe=!1,Se=0,Ce=!1;R.onTiltData=()=>{xe&&n.controls===`tilt`&&(xe=!1,Me(),setTimeout(()=>R.calibrateTilt(),200),je(`Tilt steering active`))};let z=()=>{he()&&n.controls===`tilt`&&R.tiltState!==`granted`&&R.requestTilt().then(()=>Me())},we=0,Te=()=>{let e=$(`rot-hint`),t=B===`playing`&&he()&&innerHeight>innerWidth&&innerWidth<600;e.classList.toggle(`hidden`,!t),clearTimeout(we),t&&(we=window.setTimeout(()=>e.classList.add(`hidden`),4e3))};window.addEventListener(`orientationchange`,()=>setTimeout(Te,200));let Ee=()=>{clearTimeout(Se),Te(),R.touchActive&&n.controls===`tilt`&&(xe=!1,R.scheme=`tilt`,Ce=!0,setTimeout(()=>{R.tiltEvents>0&&(Ce=!1,R.calibrateTilt())},250),Se=window.setTimeout(()=>{B===`playing`&&R.scheme===`tilt`&&R.tiltEvents===0?(xe=!0,R.scheme=`halves`,Me(),je(R.tiltState===`denied`?`Motion access denied — using touch halves`:`No tilt sensor data — using touch halves`)):Ce&&(Ce=!1,R.calibrateTilt())},1800))},B=`loading`,De=(e,t)=>$(e).classList.toggle(`hidden`,!t),Oe=$(`drawer`),ke=e=>{Oe.classList.toggle(`open`,e),Oe.setAttribute(`aria-hidden`,String(!e))},Ae=0,je=e=>{let t=$(`toast`);t.textContent=e,t.classList.remove(`hidden`),clearTimeout(Ae),Ae=window.setTimeout(()=>t.classList.add(`hidden`),1600)},Me=()=>{document.body.classList.toggle(`touch`,he()),De(`menu`,B===`menu`),De(`garage`,B===`garage`),De(`modes`,B===`modes`),De(`levels`,B===`levels`),De(`lobby`,B===`lobby`),B!==`playing`&&$(`ohud`).classList.add(`hidden`),De(`results`,B===`results`),De(`mhud`,!!q&&(B===`playing`||B===`paused`)),De(`btn-quit`,!!q),$(`btn-reset`).textContent=q?`Reset to checkpoint`:`Reset vehicle`;let e=`Lv ${Xp(r.xp)} · ${r.credits.toLocaleString()} pts · ${r.xp%300}/300 XP${rm()?` · DEV`:``}`;$(`menu-prog`).textContent=e,$(`modes-prog`).textContent=e,$(`levels-prog`).textContent=e,De(`pause`,B===`paused`),De(`hud`,B===`playing`||B===`paused`);let t=B===`playing`&&he();R.touchActive=t,xe||(R.scheme=n.controls),R.autoThrottle=n.autoThrottle;let i=R.scheme;De(`tzones`,t&&i===`halves`),De(`cockpit`,t&&i!==`halves`),$(`cockpit`).dataset.sc=i,De(`wheel`,i===`wheel`),De(`steer-btns`,i===`buttons`),De(`ck-cal`,i===`tilt`),De(`selbar`,B===`playing`||B===`paused`),De(`drv`,B===`playing`||B===`paused`),B!==`playing`&&$(`drv-pop`).classList.add(`hidden`),be(),De(`row-wsens`,n.controls===`wheel`),$(`rng-wsens`).value=String(n.wheelSens),$(`tz-l`).textContent=i===`halves`?`◀ STEER`:`BRAKE`,$(`tz-r`).textContent=i===`halves`?`STEER ▶`:n.autoThrottle?`AUTO-GAS`:`GAS`,$(`tz-hint`).textContent=i===`halves`?`Drives forward · hold both sides to brake / reverse`:i===`tilt`?`Tilt the phone to steer`:``,De(`tp-cal`,i===`tilt`),document.querySelectorAll(`#seg-ctrl button`).forEach(e=>e.classList.toggle(`on`,e.dataset.v===n.controls)),$(`chk-auto`).checked=n.autoThrottle,$(`ctrl-note`).textContent=n.controls===`wheel`?`Default: turn the steering wheel (bottom-left) by dragging your finger around it - up to 1¼ turns each way, it centres itself when released. Pedals (bottom-right): GAS and BRAKE are progressive; brake at a standstill reverses in AUTO.`:n.controls===`buttons`?`Optional: hold ◀ / ▶ (bottom-left) to steer and GAS (bottom-right) to drive; BRAKE / REV brakes, keep holding at a standstill to reverse. Steer and GAS work together (multi-touch).`:n.controls===`tilt`?`Tilt the phone like a steering wheel; pedals bottom-right${n.autoThrottle?` (auto-throttle on: GAS is automatic, BRAKE overrides)`:``}. Motion access: ${R.tiltState}${xe?` (using touch halves)`:``}.`:n.controls===`halves`?`Default: hold the left or right half of the screen to steer. The car drives forward by itself; hold both halves or ■ Brake/Rev to brake, keep holding at a standstill to reverse.`:``,$(`hud-fps`).classList.toggle(`hidden`,!n.showFps),document.querySelectorAll(`#seg-preset button`).forEach(e=>e.classList.toggle(`on`,e.dataset.v===n.preset)),document.querySelectorAll(`#seg-touch button`).forEach(e=>e.classList.toggle(`on`,e.dataset.v===n.touch)),$(`chk-fps`).checked=n.showFps,$(`chk-intro`).checked=n.intro,$(`rng-camdist`).value=String(n.camDist),$(`rng-camheight`).value=String(n.camHeight),document.querySelectorAll(`#seg-shake button`).forEach(e=>e.classList.toggle(`on`,e.dataset.v===n.shakeLevel)),$(`chk-mute`).checked=n.muted,$(`rng-volume`).value=String(n.volume),$(`btn-mute`).textContent=n.muted?`🔇`:`🔊`},Ne=e=>{let t=B;B=e,Zt&&e!==`playing`&&e!==`paused`&&ln(),e!==`paused`&&e!==`menu`&&ke(!1),R.clearTouch(),Me(),e===`playing`&&t!==`paused`&&Ee()},Pe=Math.max(0,np.findIndex(e=>e.id===n.vehicle));function V(t,r=!1){(E.spec.id!==t||r)&&(E.dispose(),E=new Of(S,e,l,C,i(t),w(t),T(n.preset)),A(),me(F))}function Fe(){let e=np[Pe];$(`g-name`).textContent=e.name,$(`g-class`).textContent=e.klass,$(`g-desc`).textContent=e.desc,$(`g-dots`).innerHTML=np.map((e,t)=>`<i class="${t===Pe?`on`:``}"></i>`).join(``),$(`g-cats`).innerHTML=tp.map(t=>`<button data-cat="${t.id}" class="${t.id===e.cat?`on`:``}">${t.label} <b>${np.filter(e=>e.cat===t.id).length}</b></button>`).join(``),$(`g-cats`).querySelectorAll(`button`).forEach(e=>e.onclick=()=>{let t=np.findIndex(t=>t.cat===e.dataset.cat);t>=0&&t!==Pe&&Ie(t-Pe)});{let t=im(r,e.id),i=Jp[e.id];$(`g-price`).textContent=t?e.id===n.vehicle?`✓ Selected`:`✓ Owned`:`${i.price.toLocaleString()} pts · level ${i.level}`,$(`g-price`).className=`g-price `+(t?`own`:`buy`)}let t=ap(e);$(`g-stats`).innerHTML=Object.entries(t).map(([e,t])=>`<span>${e}</span><div class="bar"><i style="width:${Math.round(t*100)}%"></i></div>`).join(``);let i=w(e.id);$(`g-colors`).innerHTML=ip.map(e=>`<button data-hex="${e.hex}" title="${e.name}${am(r,e.hex)?``:` (level `+Yp(e.hex)+`)`}" aria-label="${e.name}" class="${e.hex===i?`on`:``} ${am(r,e.hex)?``:`locked`}" style="background:#${e.hex.toString(16).padStart(6,`0`)}"></button>`).join(``),$(`g-paint-name`).textContent=ip.find(e=>e.hex===i)?.name??`Custom`,$(`g-colors`).querySelectorAll(`button`).forEach(t=>t.onclick=()=>{let i=Number(t.dataset.hex);am(r,i)?(n.paints[e.id]=i,Cp(n),E.setPaint(i),Fe()):je(`🔒 Unlocks at level ${Yp(i)}`)});let a=im(r,e.id),o=Jp[e.id],s=Xp(r.xp);if(De(`g-lock`,!a),$(`g-drive`).disabled=!a,!a){$(`g-lock-text`).textContent=`🔒 Requires level ${o.level} · ${o.price.toLocaleString()} pts`;let t=$(`g-unlock`);t.disabled=s<o.level||r.credits<o.price,t.textContent=s<o.level?`Level ${o.level}`:`Unlock ${o.price.toLocaleString()} pts`,t.onclick=()=>{Le(e.id)&&je(`${e.name} unlocked!`)}}let c=om(r,e.id),l={engine:`Engine`,tyres:`Tyres`,susp:`Suspension`};$(`g-upgrades`).innerHTML=a?qp.map(e=>`<span>${l[e]}</span><span class="pips">${Array.from({length:3},(t,n)=>`<i class="${n<c[e]?`on`:``}"></i>`).join(``)}</span><button class="btn small" data-up="${e}" ${c[e]>=3||r.credits<Zp(c[e])?`disabled`:``}>${c[e]>=3?`Max`:`+ `+Zp(c[e])+` pts`}</button>`).join(``):``,$(`g-upgrades`).querySelectorAll(`button`).forEach(t=>t.onclick=()=>{H(e.id,t.dataset.up)&&je(`${l[t.dataset.up]} upgraded`)}),$(`g-credits`).textContent=`${r.credits.toLocaleString()} points · level ${s}`,$(`menu-vehicle`).textContent=rp(n.vehicle).name}let Ie=e=>{Pe=(Pe+e+np.length)%np.length;let t=np[Pe].id;im(r,t)&&(n.vehicle=t,Cp(n)),V(t),Fe(),Ve=0};function Le(e){let t=Jp[e];return r.vehicles.includes(e)||Xp(r.xp)<t.level||r.credits<t.price?!1:(r.credits-=t.price,r.vehicles.push(e),nm(r),n.vehicle=e,Cp(n),Fe(),Me(),!0)}function H(e,t){if(!im(r,e))return!1;let n={...om(r,e)},i=Zp(n[t]);return n[t]>=3||r.credits<i?!1:(r.credits-=i,n[t]++,r.upgrades[e]=n,nm(r),E.spec.id===e&&V(e,!0),B===`garage`&&Fe(),Me(),!0)}let Re=()=>{E.spec.id!==n.vehicle&&V(n.vehicle)},U=null,W=null,Ve=0,He=null,Ue=(e=`menu`)=>{We=e,Pe=Math.max(0,np.findIndex(e=>e.id===n.vehicle)),Fe(),A(),Ve=0,Ne(`garage`)};$(`btn-garage`).onclick=()=>Ue(`menu`),$(`g-prev`).onclick=()=>Ie(-1),$(`g-next`).onclick=()=>Ie(1),$(`g-back`).onclick=()=>{Re(),Ne(We)},$(`g-drive`).onclick=()=>{im(r,E.spec.id)&&(We===`modes`?(Ne(`modes`),bt()):We===`levels`?yt():$(`btn-play`).click())};let We=`menu`,q=null,Ge=null,J=null,Y=null,Ke=0,qe=!1,Je=0,Ye=0,Xe=null,Ze=`challenge`,Qe=null;ee=()=>q?.jumped();let $e={add(){},lift(){},reset(){}},et={throttle:0,brake:0,steer:0,handbrake:!1},tt=(e,t)=>e.reset(t.x,wd(t.x,t.z)+e.spawnLift,t.z,t.yaw),nt=()=>new K(0,E.spec.chassis.y,-E.spec.chassis.hz-.1),rt=()=>new K(0,J.spec.chassis.y,J.spec.chassis.hz+.1),it=(e,t)=>{let n=e.body.translation(),r=e.body.rotation();return t.clone().applyQuaternion(new Be(r.x,r.y,r.z,r.w)).add(new K(n.x,n.y,n.z))};function at(t){Y&&S.removeImpulseJoint(Y,!0);let n=nt(),r=rt();Y=S.createImpulseJoint(e.JointData.rope(t,{x:n.x,y:n.y,z:n.z},{x:r.x,y:r.y,z:r.z}),E.body,J.body,!0),Ke=t}function ot(){if(!q||!J||q.state!==`running`)return!1;if(Y)return S.removeImpulseJoint(Y,!0),Y=null,q.attached=!1,q.say(`Rope released`),!0;let e=it(E,nt()).distanceTo(it(J,rt()));return e>10?(q.say(`Too far to hook up (${e.toFixed(0)} m) — back up closer`),!1):(at(Math.max(3,e+.3)),q.attached=!0,q.reached=!0,q.say(`Tow rope attached — drag it to the safe zone!`,2.5),!0)}function ct(){let e=E.body.translation(),t=E.forward(),n=E.body.rotation();return{x:e.x,z:e.z,yaw:Math.atan2(t.x,t.z),speed:E.forwardSpeed(),up:1-2*(n.x*n.x+n.z*n.z)}}function lt(e){let t=q&&(q.state===`countdown`||q.finished)?Qm:e;if(E.step(jr,t),Qt&&Qt.step(jr,$t),J&&(J.body.setLinearDamping(J.surface()===`mud`?.7:.05),J.step(jr,et)),Y&&qe&&(Je+=jr,Je>.2&&Ke>3&&(Je=0,at(Math.max(3,Ke-.35)))),S.step(),q){E.body.translation();let e=J?.body.translation();q.update(jr,ct(),{stuck:e?{x:e.x,z:e.z}:void 0})}}function ut(t){let i=Um(t);if(i){if(dt(),im(r,n.vehicle)||(n.vehicle=`scout`),V(n.vehicle),q=new Up(i),Ge=new Gp(l,i),i.laps&&(Ge.lapLen=i.gates.length/i.laps),Ge.setGateState(0),i.stuck){J=new Of(S,e,l,$e,rp(`voyager`),8093831,0);for(let e of[...J.headlights,J.beam])e.visible=!1;tt(J,i.stuck);for(let e=0;e<90;e++)J.step(jr,{...et,handbrake:!0}),S.step();J.sync()}Qe=i.weather??(i.type===`deliver`?`sunset`:null),Qe&&me(Qe),A(i.start.x,i.start.z,i.start.yaw),E.dirt=0,Ye=0,_r=!1,n.intro&&$(`intro`).classList.add(`hidden`),De(`btn-mreset`,!i.noReset),Ne(`playing`)}}function dt(){q&&(Y&&(S.removeImpulseJoint(Y,!0),Y=null),J&&(J.dispose(),J=null),Ge?.dispose(),Ge=null,q=null,qe=!1,Qe&&(Qe=null,me(n.weather)),$(`countdown`).classList.add(`hidden`),Me())}function ft(){q&&q.requestReset()&&(Y&&(S.removeImpulseJoint(Y,!0),Y=null,q.attached=!1),A(q.last.x,q.last.z,q.last.yaw),_r=!1)}let pt=e=>`${Math.floor(e/60)}:${(e%60).toFixed(1).padStart(4,`0`)}`,mt={gold:`🥇`,silver:`🥈`,bronze:`🥉`,none:`🏁`};function ht(){if(!q)return;let e=q,t=e.def,n=e.state===`success`,i=n?e.t:null,a=n?Hp(e.t,t.targets):`none`,o=r.best[t.id]?.time??null,s=cm(r,t.id,i,a,t.reward);s.newBest&&(r.best[t.id].splits=e.splits.slice()),nm(r),Xe={id:t.id,success:n,time:i,medal:a,...s,prevBest:o,splits:e.splits.slice(),rejected:e.rejected,resets:e.resets,failReason:e.failReason},$(`r-kicker`).textContent={race:`Desert checkpoint race`,challenge:`Off-road challenge`,rescue:`Rescue & recovery`}[t.mode],$(`r-title`).textContent=n?t.title+` — complete`:t.title+` — failed`,$(`r-medal`).innerHTML=n?`${mt[a]}<em>${a===`none`?`finished`:a}</em>`:`✖<em>${e.failReason}</em>`;let c=[];n&&c.push([`Time`,pt(e.t)]),c.push([`Best`,r.best[t.id]?pt(r.best[t.id].time)+(s.newBest?`  NEW!`:``):`—`]),c.push([`Targets`,`🥇 ${pt(t.targets.gold)} · 🥈 ${pt(t.targets.silver)} · 🥉 ${pt(t.targets.bronze)}`]),e.splits.forEach((e,t)=>c.push([`Split ${t+1}`,pt(e)])),e.rejected&&c.push([`Missed-gate warnings`,String(e.rejected)]),$(`r-grid`).innerHTML=c.slice(0,7).map(([e,t])=>`<span>${e}</span><b>${t}</b>`).join(``)+(c.length>7?`<span>…</span><b>${c.length-7} more splits</b>`:``);let l=qm(t.id),u=l?Wm.find(e=>e.n===l.n+1):null;Xe.level=l?.n??null,Xe.nextUnlocked=!!(n&&u&&Km(r.best,u)),$(`r-reward`).textContent=`+${s.credits} points · +${s.xp} XP`+(s.levelUp?` · LEVEL ${s.levelUp}!`:``)+(l&&n?` · Level ${l.n} complete`+(u&&Xe.nextUnlocked?` — Level ${u.n} unlocked!`:``):``),$(`r-kicker`).textContent=l?`Level ${l.n} · ${l.difficulty}`:$(`r-kicker`).textContent,Ne(`results`)}let gt=e=>{let t=qm(e);return t?Wm.find(e=>e.n>t.n&&e.missionId&&Km(r.best,e,rm()))?.missionId??null:Bp[(Bp.findIndex(t=>t.id===e)+1)%Bp.length].id};$(`r-retry`).onclick=()=>{let e=q?.def.id;e&&ut(e)},$(`r-next`).onclick=()=>{let e=q?.def.id,t=e?gt(e):null;t?ut(t):e&&qm(e)&&(dt(),yt())},$(`r-menu`).onclick=()=>{let e=!!(q&&qm(q.def.id));dt(),e?yt():(Ne(`modes`),bt())};let _t={playable:`Playable`,prototype:`Prototype`,online:`Needs server`,planned:`Not built yet`};function vt(){let e=rm();$(`lv-list`).innerHTML=Wm.map(t=>{let n=Gm(r.best,t),i=Km(r.best,t,e),a=t.missionId?r.best[t.missionId]:null,o=!!t.missionId&&i,s=(n&&a?`${mt[a.medal]} best ${pt(a.time)} · `:i?``:`🔒 locked · `)+t.difficulty,c=t.status===`online`?`<button class="btn small" data-online>Online</button>`:o?`<button class="btn primary small" data-level="${t.missionId}">${n?`Replay`:`Start`}</button>`:`<button class="btn small" disabled>${t.status===`planned`?`Soon`:`🔒`}</button>`;return`<div class="m-card lv-card ${i?``:`locked`}" data-n="${t.n}"><h3><span class="lvn">${t.n}</span>${t.title}<span class="st ${t.status}">${_t[t.status]}</span></h3><div class="meta">${s}</div>${c}<p>${t.objective}${t.note?` <em>`+t.note+`</em>`:``}${t.unlock&&!n?` · `+t.unlock:``}</p></div>`}).join(``),$(`lv-list`).querySelectorAll(`[data-level]`).forEach(e=>e.onclick=()=>{z(),ut(e.dataset.level)}),$(`lv-list`).querySelectorAll(`[data-online]`).forEach(e=>e.onclick=()=>$(`btn-online`).click())}let yt=()=>{vt(),Ne(`levels`)};$(`btn-levels`).onclick=()=>yt(),$(`lv-back`).onclick=()=>Ne(`menu`),$(`lv-garage`).onclick=()=>Ue(`levels`);function bt(){document.querySelectorAll(`#m-tabs button`).forEach(e=>{e.classList.toggle(`on`,e.dataset.mode===Ze),e.onclick=()=>{Ze=e.dataset.mode,bt()}});let e=$(`m-list`);e.innerHTML=Ze===`free`?`<div class="m-card"><h3>Free Roam</h3><div class="meta">Open map · no timer</div><button class="btn primary small" data-free>Drive</button><p>Explore the mud basin, dunes, rocky ridge and proving-ground strip at your own pace.</p></div>`:Bp.filter(e=>e.mode===Ze).map(e=>{let t=r.best[e.id];return`<div class="m-card"><h3>${e.title}</h3><div class="meta">${t?mt[t.medal]+` best `+pt(t.time):`not completed`} · ${e.limit?`limit `+pt(e.limit):`no limit`} · ${e.reward} pts</div><button class="btn primary small" data-start="${e.id}">Start</button><p>${e.desc}</p></div>`}).join(``),e.querySelectorAll(`[data-start]`).forEach(e=>e.onclick=()=>{z(),ut(e.dataset.start)}),e.querySelector(`[data-free]`)?.addEventListener(`click`,()=>$(`btn-play`).click()),Me()}$(`btn-modes`).onclick=()=>{bt(),Ne(`modes`)},$(`m-back`).onclick=()=>Ne(`menu`),$(`m-garage`).onclick=()=>Ue(`modes`),$(`btn-hook`).onclick=()=>ot(),$(`btn-mreset`).onclick=()=>ft();let xt=$(`btn-winch`);xt.addEventListener(`pointerdown`,()=>{qe=!0});for(let e of[`pointerup`,`pointerleave`,`pointercancel`])xt.addEventListener(e,()=>{qe=!1});let St=new K,Ct=0;function wt(e){if(!q)return;let t=q,n=t.def,i=ct();$(`mh-title`).textContent=n.title,$(`mh-time`).textContent=t.state===`countdown`?pt(0):pt(n.limit!==null&&n.type!==`race`?Math.max(0,n.limit-t.t):t.t);let a=null,o=``;if(n.gates.length&&t.next<n.gates.length){a=n.gates[t.next];let e=t.splits.length?t.splits[t.splits.length-1]:null,i=r.best[n.id]?.splits?.[t.splits.length-1];o=`Next CP ${t.next+1}/${n.gates.length}`+(e===null?``:` · split ${pt(e)}`+(i===void 0?``:` (${e-i>=0?`+`:`−`}${Math.abs(e-i).toFixed(1)})`)),n.noReset&&(o+=` · no resets`)}else if(n.type===`tow`&&J){let e=J.body.translation();a=t.attached?n.zone:{x:e.x,z:e.z},o=t.attached?`Tow to safe zone · ${Math.hypot(e.x-n.zone.x,e.z-n.zone.z).toFixed(0)} m`:`Reach the stuck 4x4 and hook up`}else n.zone&&(a=n.zone,o=n.type===`deliver`?`Deliver to camp before dark`:n.type===`trail`?`Stop inside the finish circle`:`Reach the summit flag`);if($(`mh-sub`).textContent=o+(n.limit!==null&&n.type!==`race`?` · time left`:``),a){d.getWorldDirection(St);let e=Math.atan2(a.x-i.x,a.z-i.z)-Math.atan2(St.x,St.z),t=Math.atan2(Math.sin(e),Math.cos(e));$(`mh-arrow`).style.transform=`rotate(${(-t).toFixed(3)}rad)`,$(`mh-dist`).textContent=`${Math.hypot(a.x-i.x,a.z-i.z).toFixed(0)} m`}let c=$(`mh-msg`);c.textContent=t.msgT>0?t.msg:``,c.classList.toggle(`warn`,/Wrong|Missed|failed|Too far/.test(t.msg));let l=$(`countdown`);t.state===`countdown`?(l.classList.remove(`hidden`),l.textContent=String(Math.ceil(t.countdown))):t.state===`running`&&t.t<.7?(l.classList.remove(`hidden`),l.textContent=`GO!`):l.classList.add(`hidden`),De(`btn-hook`,n.type===`tow`&&t.state===`running`&&(t.reached||!!Y)),$(`btn-hook`).textContent=Y?`Release (H)`:`Hook (H)`,De(`btn-winch`,!!Y),Ge?.setGateState(t.next),J&&(J.sync(),Ge?.setRope(Y?it(E,nt()):null,Y?it(J,rt()):void 0)),n.type===`deliver`&&!t.finished&&(Ct=$m(.25,1,t.t/n.limit),s.toneMappingExposure=gp.sunset.exposure*(1-.6*Ct),p.intensity=gp.sunset.sunI*(1-.85*Ct),f.intensity=gp.sunset.hemiI*(1-.6*Ct)),t.finished&&B===`playing`&&(Ye+=e,Ye>1.2&&ht())}let Tt=`owf.mp.name`;localStorage.getItem(Tt)||localStorage.setItem(Tt,`Driver`+Math.floor(100+Math.random()*900));let Et=new Dm({world:S,R:e,scene:l,camera:d,car:()=>E,useCar:(t,r)=>(dt(),E.dispose(),E=new Of(S,e,l,C,rp(t),r,T(n.preset)),E.setProfile(`pro`),me(F),_r=!1,E),restoreCar:()=>{V(n.vehicle,!0),A(),_r=!1},profile:()=>({name:localStorage.getItem(Tt)||`Driver`,vehicle:n.vehicle,paint:w(n.vehicle)}),setName:e=>{let t=e.replace(/[^\p{L}\p{N} _.\-]/gu,``).trim().slice(0,16);t&&localStorage.setItem(Tt,t)},setPhase:e=>Ne(e),phase:()=>B,toast:e=>je(e),resetCamera:()=>{_r=!1}});$(`btn-online`).onclick=()=>{dt(),Re(),Ne(`lobby`),Et.renderLobby()},$(`lb-back`).onclick=()=>Ne(Et.inRoom?`playing`:`menu`),$(`btn-olobby`).onclick=()=>Ne(`lobby`);let Dt=0,Ot=(e=500)=>{Dt=performance.now()+e};document.addEventListener(`click`,e=>{performance.now()<Dt&&(e.stopPropagation(),e.preventDefault())},!0);for(let e of[`gesturestart`,`gesturechange`,`gestureend`])document.addEventListener(e,e=>e.preventDefault(),{passive:!1});document.addEventListener(`touchmove`,e=>{(B===`playing`||B===`opening`)&&e.preventDefault()},{passive:!1});let kt=7.6,At=0,jt=()=>{if(B!==`intro`)return;Ot();let e=$(`intro`);e.classList.add(`out`),$(`intro-name`).parentElement.classList.remove(`show`),setTimeout(()=>{B!==`intro`&&e.classList.add(`hidden`)},650),hr.copy(d.position),vr=Math.atan2(E.forward().x,E.forward().z),_r=!0,Ne(`playing`)},Mt=[[74,-52],[64,-44],[51,-35],[39,-27],[27,-21],[15,-13],[6,-6]],Nt=12.5,Pt=0,Ft=1,It=!1,Lt=1,Rt=()=>{let[e,t]=Mt;A(e[0],e[1],Math.atan2(t[0]-e[0],t[1]-e[1])),Pt=0,Ft=1,It=!1;let n=$(`opening`);n.classList.remove(`hidden`,`out`),n.classList.add(`in`),B=`opening`,Me()},zt=e=>{if(B!==`opening`||It)return;if(It=!0,e&&Ot(),e){let e=Mt[Mt.length-1],t=Mt[Mt.length-2];A(e[0],e[1],Math.atan2(e[0]-t[0],e[1]-t[1]))}let t=$(`opening`);t.classList.add(`out`),setTimeout(()=>t.classList.add(`hidden`),900),Sr=0,Lt=0,Ne(`menu`);let n=$(`menu`);n.classList.remove(`reveal`),n.offsetWidth,n.classList.add(`reveal`)};function Bt(){let e=E.body.translation(),t=E.forward(Mr),n=Mt.length-1,r=Mt[Ft];Math.hypot(r[0]-e.x,r[1]-e.z)<7&&Ft<n&&(Ft++,r=Mt[Ft]);let i=Math.hypot(r[0]-e.x,r[1]-e.z),a=Math.atan2(r[0]-e.x,r[1]-e.z)-Math.atan2(t.x,t.z);a=Math.atan2(Math.sin(a),Math.cos(a));let o=ze.clamp(a*2.2,-1,1),s=E.forwardSpeed();return Ft===n&&i<16?{throttle:0,brake:s>.6?Math.min(1,.35+(16-i)/16):0,steer:o,handbrake:s<=.6}:{throttle:s<7.2?.75:.15,brake:0,steer:o,handbrake:!1}}let Vt=(e,t,n,r,i)=>{let a=n+2.2+t,o=9.5,s=window.innerWidth<window.innerHeight;r.set(e.x+Math.sin(a)*o,e.y+2.6,e.z+Math.cos(a)*o),i.set(e.x,e.y+(s?-1.2:.6),e.z)},Ht=new K,Gt=new K,Kt=new K,qt=new K;function Jt(e,t,n){let r=Pt;window.innerWidth,window.innerHeight;let i=(e,t)=>wd(e,t);if(r<4.2){let t=$m(0,4.2,r);Kt.set(-46,i(-46,38)+46,38),qt.set(-14,i(-14,20)+20,20),Ht.lerpVectors(Kt,qt,t),Gt.set(110-60*t,6+2*(1-t),-90+50*t).lerp(e,t*t)}else if(r<8)Ht.set(33,i(33,-16)+.9,-16),Gt.set(e.x,e.y+.7,e.z);else if(r<10.3){let n=Math.sin(t),i=Math.cos(t),a=(r-8)/(10.3-8),o=t+.7+a*.9,s=7.5-a*1.2;Ht.set(e.x+Math.sin(o)*s,e.y+1.3+a*.6,e.z+Math.cos(o)*s),Gt.set(e.x+n*1.2,e.y+.7,e.z+i*1.2)}else{let n=$m(10.3,Nt,r),i=t+1.6,a=6.3;Kt.set(e.x+Math.sin(i)*a,e.y+1.9,e.z+Math.cos(i)*a),Vt(e,t,0,qt,Gt),Ht.lerpVectors(Kt,qt,n)}let a=i(Ht.x,Ht.z)+.6;Ht.y<a&&(Ht.y=a),d.position.lerp(Ht,r<.05?1:1-Math.exp(-n*6)),gr.lerp(Gt,r<.05?1:1-Math.exp(-n*6)),d.lookAt(gr),d.fov=r<4.2?I-10:r<8?I-18:I,d.updateProjectionMatrix(),$(`opening`).classList.toggle(`titled`,r>1.2&&r<5.6)}let Yt=()=>{let e=(hp.indexOf(F)+1)%hp.length;n.weather=hp[e],Cp(n),me(n.weather),je(gp[n.weather].icon+`  `+gp[n.weather].label)},Xt=()=>{n.muted=!n.muted,Cp(n),a.setVolume(n.volume,n.muted),Me(),je(n.muted?`Sound off`:`Sound on`)};$(`btn-play`).onclick=()=>{z(),dt(),Re(),A(),_r=!1,Ne(`playing`)},$(`btn-skip`).onclick=e=>{e.stopPropagation(),jt()};let Zt=!1,Qt=null,$t=Qm,en=new wo(62,1,.1,900),tn=new K,nn=new K,rn=0,an=!1,on=3112913;function sn(){let e=O.yaw,t=O.x+Math.cos(e)*4.5,n=O.z-Math.sin(e)*4.5;Qt.reset(t,wd(t,n)+Qt.spawnLift,n,e),an=!1}function cn(){z(),dt(),Re(),A(),_r=!1,Qt&&Qt.dispose();let t=im(r,n.vehicle)?n.vehicle:`scout`;Qt=new Of(S,e,l,C,i(t),w(t)===on?14196768:on,T(n.preset)),sn(),Qt.setEnv(le?le.texture:D,gp[F].env*1.5),Zt=!0,R.split=!0,document.body.classList.add(`split`),Ne(`playing`),je(`2 players: P1 = WASD · P2 = arrow keys`)}function ln(){Zt&&(Zt=!1,R.split=!1,document.body.classList.remove(`split`),Qt&&(Qt.dispose(),Qt=null),d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix())}$(`btn-split`).onclick=()=>cn(),$(`p2-rec`).onclick=()=>{if(!Qt)return;let e=Qt.body.translation(),t=Qt.forward();Qt.reset(e.x,wd(e.x,e.z)+Qt.spawnLift,e.z,Math.atan2(t.x,t.z))};let un=$(`p2-wheel`).querySelector(`.w-turn`);R.onWheel2=e=>{un.style.transform=`rotate(${e.toFixed(1)}deg)`},R.bindWheel($(`p2-wheel`),R.p2wheel,e=>R.onWheel2(e));for(let[e,t]of[[`p2-gas`,`gas`],[`p2-brake`,`brake`]])R.bindHold($(e),t,R.p2touch);let dn=()=>he()||window.innerWidth<window.innerHeight;function fn(e){let t=Qt,r=t.group.position,i=t.forward(),a=Math.atan2(i.x,i.z),o=t.body.linvel(),s=Math.hypot(o.x,o.z),c=a-rn;c=Math.atan2(Math.sin(c),Math.cos(c)),an?rn+=c*Math.min(1,e*(2.5+s*.08)):rn=a;let l=(7.4+Math.min(3,Math.abs(t.forwardSpeed())*.085))*n.camDist,u=(2.7+Math.min(.9,s*.03))*n.camHeight,d=r.x-Math.sin(rn)*l,f=r.z-Math.cos(rn)*l,p=Math.max(r.y+u,wd(d,f)+1);an||(tn.set(d,p,f),nn.set(r.x,r.y+1.1,r.z),an=!0),tn.lerp(Xm.set(d,p,f),1-Math.exp(-e*6)),nn.lerp(Xm.set(r.x+o.x*.12,r.y+1.1,r.z+o.z*.12),1-Math.exp(-e*10)),en.position.copy(tn),en.lookAt(nn),en.fov=I+Math.min(14,Math.abs(t.forwardSpeed())*.45)}function pn(){let e=window.innerWidth,t=window.innerHeight,n=dn(),r=n?[0,0,e,t/2]:[0,0,e/2,t],i=n?[0,t/2,e,t/2]:[e/2,0,e/2,t];d.aspect=r[2]/r[3],d.updateProjectionMatrix(),en.aspect=i[2]/i[3],en.far=d.far,en.updateProjectionMatrix(),s.setScissorTest(!0),s.setViewport(r[0],r[1],r[2],r[3]),s.setScissor(r[0],r[1],r[2],r[3]),s.render(l,d),s.setViewport(i[0],i[1],i[2],i[3]),s.setScissor(i[0],i[1],i[2],i[3]),s.render(l,en),s.setScissorTest(!1),s.setViewport(0,0,e,t),document.body.classList.toggle(`split-stack`,n),$(`p2-speed`).textContent=Math.round(Math.abs(Qt.forwardSpeed())*3.6).toString()}function mn(e,t=!1){Et.inRoom&&e!==`pro`&&(je(`Online uses the PRO profile (server physics)`),e=`pro`),n.profile=e,Cp(n),Of.defaultProfile=e,E.setProfile(e),Qt?.setProfile(e),$(`prof-chip`).textContent=mf[e].label,document.querySelectorAll(`#prof-pop [data-prof]`).forEach(t=>t.classList.toggle(`on`,t.dataset.prof===e)),!n.shakeUser&&n.shakeLevel!==mf[e].shake&&(n.shakeLevel=mf[e].shake,n.shake=n.shakeLevel!==`off`,Cp(n),Me()),t||je(`🚙 ${mf[e].label}: ${mf[e].desc}`)}$(`prof-pop`).innerHTML=hf.map(e=>`<button data-prof="${e}">${mf[e].label}</button>`).join(``),$(`prof-pop`).querySelectorAll(`[data-prof]`).forEach(e=>e.onclick=()=>{mn(e.dataset.prof),$(`prof-pop`).classList.add(`hidden`)}),$(`prof-chip`).onclick=e=>{e.stopPropagation(),$(`prof-pop`).classList.toggle(`hidden`),$(`cam-pop`).classList.add(`hidden`)},document.addEventListener(`pointerdown`,e=>{e.target.closest(`#cam-pop, #cam-chip, #prof-pop, #prof-chip`)||($(`cam-pop`).classList.add(`hidden`),$(`prof-pop`).classList.add(`hidden`))});let hn=()=>{},gn=[`pro`,`far`,`cockpit`,`hood`,`bumper`,`cinematic`,`wheel`,`mirror`,`orbit`],_n={pro:`Pro Chase`,far:`Far Chase`,cockpit:`Cockpit`,hood:`Hood`,bumper:`Bumper`,cinematic:`Cinematic`,wheel:`Wheel View`,mirror:`Left Mirror`,orbit:`360° Orbit`},vn=`owf.cam.session`,yn=gn.includes(sessionStorage.getItem(vn)??``)?sessionStorage.getItem(vn):`pro`,bn=0,xn=.35,Sn=0,Cn=!1,wn=0,Tn={pos:new K,q:new Be,fov:62,t:1},En={pos:new K,set:!1,t:0,side:!1,sideSign:1,n:0},Dn=new K,On=new K,kn=new K,An=()=>{Tn.pos.copy(d.position),Tn.q.copy(d.quaternion),Tn.fov=d.fov,Tn.t=0},jn=e=>e===`pro`||e===`far`;function Mn(e,t=!1){e!==yn&&An(),yn=e,sessionStorage.setItem(vn,e),E.setCockpit(e===`cockpit`);let n=$(`btn-cam`);if(n.classList.toggle(`on`,e!==`pro`),n.dataset.mode=e,n.title=_n[e]+` (C)`,$(`cam-chip`).textContent=`🎥 `+_n[e],document.querySelectorAll(`#cam-pop [data-cam]`).forEach(t=>t.classList.toggle(`on`,t.dataset.cam===e)),e===`orbit`){let e=E.forward();bn=Math.atan2(e.x,e.z)+Math.PI*.75,Sn=0}e===`cinematic`&&(En.set=!1),t||je(`🎥 `+_n[e])}let Nn=()=>Mn(gn[(gn.indexOf(yn)+1)%gn.length]);function Pn(){Yn=0,Xn=0,Cn=!1,An(),Mn(`pro`,!0),vr=Math.atan2(E.forward().x,E.forward().z),je(`🎥 Camera reset`)}$(`btn-cam`).onclick=Nn,$(`cam-chip`).onclick=e=>{e.stopPropagation(),$(`cam-pop`).classList.toggle(`hidden`),$(`prof-pop`).classList.add(`hidden`)},$(`cam-pop`).innerHTML=gn.map(e=>`<button data-cam="${e}">${_n[e]}</button>`).join(``)+`<button data-cam-reset>↺ Reset</button>`,$(`cam-pop`).querySelectorAll(`[data-cam]`).forEach(e=>e.onclick=()=>{Mn(e.dataset.cam),$(`cam-pop`).classList.add(`hidden`)}),$(`cam-pop`).querySelector(`[data-cam-reset]`).onclick=()=>{Pn(),$(`cam-pop`).classList.add(`hidden`)},$(`btn-camreset`).onclick=()=>Pn();{let e=$(`btn-lookback`),t=t=>{Cn=t,e.classList.toggle(`active`,t)};e.addEventListener(`touchstart`,e=>{e.preventDefault(),t(!0)},{passive:!1});for(let n of[`touchend`,`touchcancel`])e.addEventListener(n,e=>{e.preventDefault(),t(!1)},{passive:!1});e.addEventListener(`pointerdown`,e=>{e.pointerType!==`touch`&&t(!0)});for(let n of[`pointerup`,`pointercancel`,`pointerleave`])e.addEventListener(n,e=>{e.pointerType!==`touch`&&t(!1)});window.addEventListener(`keydown`,e=>{R.isBound(`lookback`,e.code)&&B===`playing`&&t(!0)}),window.addEventListener(`keyup`,e=>{R.isBound(`lookback`,e.code)&&t(!1)}),hn=e=>{e!==Cn&&t(e)},window.addEventListener(`blur`,()=>t(!1)),document.addEventListener(`visibilitychange`,()=>{document.hidden&&t(!1)})}function Fn(e){let t=E.spec,n=t.cabin,r=t.chassis,i=t.wheel;switch(e){case`cockpit`:return[E.eye.clone(),new K(E.eye.x,E.eye.y-.9,E.eye.z+10)];case`hood`:{let e=r.y+r.hy+.42,t=r.hz-.35;return[new K(0,e,t),new K(0,e-.55,t+12)]}case`bumper`:{let e=r.y-r.hy+.35,t=r.hz+.25;return[new K(0,e,t),new K(0,e-.25,t+12)]}case`wheel`:{let e=i.x+i.w/2+.3,t=i.y+.05;return[new K(e,t,i.zf-i.r-.9),new K(e-.15,t-.25,i.zf+8)]}default:{let e=n.hx+.32,t=n.y-n.hy+.55,r=n.z+n.hz-.15;return[new K(e,t,r),new K(e+.9,t-.45,r-12)]}}}let In=()=>vp[n.shakeLevel]??1,Ln=0,Rn=new K,zn=0,Bn=0;function Vn(e){wn+=(+!!Cn-wn)*Math.min(1,e*9);let t=E.group.position;if(yn===`orbit`){Sn+=e,Zn===null&&Sn>2.5&&(bn+=e*.25);let n=4.5+E.spec.chassis.hz*1.6;d.position.set(t.x+Math.sin(bn)*Math.cos(xn)*n,t.y+.8+Math.sin(xn)*n,t.z+Math.cos(bn)*Math.cos(xn)*n),d.lookAt(t.x,t.y+.6,t.z),d.fov=I}else if(yn===`cinematic`){let n=E.forward(),r=E.body.linvel(),i=Math.hypot(r.x,r.z);if(En.t+=e,En.side){let r=E.spec.wheel,i=n.z,a=-n.x,o=En.sideSign,s=r.x+2.6,c=(r.zf+r.zr)/2;kn.set(t.x+i*s*o+n.x*c,0,t.z+a*s*o+n.z*c),kn.y=Math.max(wd(kn.x,kn.z)+.35,t.y-.35),En.set?En.pos.lerp(kn,1-Math.exp(-e*6)):(En.pos.copy(kn),En.set=!0),d.position.copy(En.pos),d.lookAt(t.x+n.x*c,t.y-.25,t.z+n.z*c),d.fov=I+6,En.t>7&&(En.side=!1,En.set=!1,En.t=0,An(),Tn.t=.999)}else{let e=En.set?En.pos.distanceTo(t):1e9,r=En.set&&(En.pos.x-t.x)*n.x+(En.pos.z-t.z)*n.z<-8;if(En.set&&(e>45||r||En.t>9)&&++En.n%2==1)En.side=!0,En.sideSign=Math.random()<.5?-1:1,En.set=!1,En.t=0,An(),Tn.t=.999;else if(!En.set||e>45||r||En.t>9){let e=Math.random()<.5?-1:1,r=14+Math.min(30,i*2.2),a=6+Math.random()*5;En.pos.set(t.x+n.x*r+n.z*a*e,0,t.z+n.z*r-n.x*a*e),En.pos.y=wd(En.pos.x,En.pos.z)+1.2+Math.random()*1.8,En.set=!0,En.t=0,An(),Tn.t=.999}d.position.copy(En.pos),d.lookAt(t.x,t.y+.6,t.z),d.fov=ze.clamp(2400/Math.max(8,En.pos.distanceTo(t))/2.2,22,I)}}else{yn===`cockpit`&&!E.cockpitOn&&E.setCockpit(!0),E.bodyVis.updateWorldMatrix(!0,!1);let[t,n]=Fn(yn),r=Yn+wn*Math.PI,i=-Xn*.6;kn.subVectors(n,t).applyAxisAngle(new K(0,1,0),r),kn.y+=i*10,n.copy(t).add(kn);{let r=In()*(yn===`cockpit`?1:yn===`hood`||yn===`bumper`?.5:.3);Rn.x+=(ze.clamp(-E.accLocal.x*.006,-.07,.07)*r-Rn.x)*Math.min(1,e*6),Rn.z+=(ze.clamp(-E.accLocal.y*.004,-.05,.05)*r-Rn.z)*Math.min(1,e*6);let i=E.body.linvel(),a=Math.hypot(i.x,i.z),o=E.surface(),s=o===`rock`?1:o===`mud`?.6:o===`ground`?.35:.25,c=Math.min(1,Math.abs(i.y-zn)/Math.max(e,.001)/40);zn=i.y;let l=(Math.min(1,a/20)*s*.006+c*.02)*r;Rn.y=(Math.sin(Cr*53)+Math.sin(Cr*37.3)*.6)*l,t.add(Rn),n.add(Rn),Bn=l}Dn.copy(t),E.bodyVis.localToWorld(Dn),On.copy(n),E.bodyVis.localToWorld(On);let a=wd(Dn.x,Dn.z)+.25;Dn.y<a&&(Dn.y=a),d.position.copy(Dn),d.up.set(0,1,0).applyQuaternion(E.group.quaternion),d.lookAt(On),d.up.set(0,1,0),d.fov=(yn===`cockpit`?I+8:yn===`mirror`?I-12:yn===`wheel`?I+4:I+6)+(yn===`mirror`?0:Math.min(8,Math.abs(E.forwardSpeed())*.3));let o=In(),s=Math.min(1,E.landJolt/6+Ln);d.rotateX(ze.clamp(E.accLocal.y*.0025,-.04,.04)*o),s>.05&&o>0&&(d.position.y+=Math.sin(Cr*47)*.02*s*o,d.rotateZ(Math.sin(Cr*31)*.01*s*o))}d.near=yn===`cockpit`||yn===`wheel`||yn===`mirror`?.05:.1,d.updateProjectionMatrix()}Mn(yn,!0),mn(n.profile??`pro`,!0),Tn.t=1;function Hn(e,t=!1){n.speedMode=e,Cp(n),Of.speedMode=e,$(`spd-chip`).textContent=e===`low`?`LOW 25`:`NORMAL`,$(`spd-chip`).classList.toggle(`on`,e===`low`),document.querySelectorAll(`#seg-speed button`).forEach(t=>t.classList.toggle(`on`,t.dataset.v===e)),t||je(e===`low`?`🐢 Speed limit LOW: 25 km/h`:`Speed limit NORMAL: ${Math.round(E.capKmh||50)} km/h max`)}Hn(n.speedMode??`normal`,!0),$(`spd-chip`).onclick=e=>{e.stopPropagation(),Hn(n.speedMode===`low`?`normal`:`low`)},document.querySelectorAll(`#seg-speed button`).forEach(e=>e.onclick=()=>Hn(e.dataset.v));let Un=e=>e.replace(/^Key/,``).replace(/^Digit/,``).replace(`Arrow`,``).replace(`Space`,`Space`).replace(`Escape`,`Esc`);function Wn(){$(`bind-list`).innerHTML=Object.keys(sp).map(e=>`<div class="bind-row"><span>${sp[e]}</span><button class="btn small" data-bind="${e}">${R.bindings[e].map(Un).join(` / `)}</button></div>`).join(``),$(`bind-list`).querySelectorAll(`[data-bind]`).forEach(e=>e.onclick=()=>{let t=e.dataset.bind;e.textContent=`Press a key…`,R.capture=e=>{if(e!==`Escape`){for(let n of Object.keys(R.bindings))n!==t&&R.bindings[n].includes(e)&&R.setBinding(n,R.bindings[n].filter(t=>t!==e));R.setBinding(t,[e])}Wn()}})}Wn(),$(`bind-reset`).onclick=e=>{e.preventDefault(),R.resetBindings(),Wn()};{let e=$(`rng-pdz`),t=$(`rng-psens`),n=(()=>{try{return JSON.parse(localStorage.getItem(`owf.pad`)||`{}`)}catch{return{}}})();R.padDeadzone=n.dz??.12,R.padSens=n.sens??1,e.value=String(R.padDeadzone),t.value=String(R.padSens);let r=()=>{R.padDeadzone=+e.value,R.padSens=+t.value,localStorage.setItem(`owf.pad`,JSON.stringify({dz:R.padDeadzone,sens:R.padSens}))};e.oninput=r,t.oninput=r,window.addEventListener(`gamepadconnected`,e=>{$(`pad-status`).textContent=e.gamepad.id.slice(0,40),je(`🎮 Gamepad connected`)}),window.addEventListener(`gamepaddisconnected`,()=>{$(`pad-status`).textContent=`none connected`,je(`🎮 Gamepad disconnected`)})}window.addEventListener(`blur`,()=>{B===`playing`&&!Et.inRoom&&!(window.__noAutoPause??/[?&]dev=1/.test(location.search))&&Ne(`paused`)}),R.onPadAction=e=>{B===`playing`&&(e===`camera`&&!Zt?Nn():e===`camreset`&&!Zt?Pn():e===`reset`?R.onReset():e===`pause`&&R.onPause())};let Gn=0;function Kn(e){if(!R.pollPad())return;if(B===`playing`){hn(R.padHeld(up.RB));return}let t=document.querySelector(`#drawer:not(.hidden), #pause:not(.hidden), #results:not(.hidden), #garage:not(.hidden), #lobby:not(.hidden), #modes:not(.hidden), #levels:not(.hidden), #menu:not(.hidden)`);if(!t)return;let n=[...t.querySelectorAll(`button:not([disabled]), input, select`)].filter(e=>e.getClientRects().length>0);if(!n.length)return;let r=n.indexOf(document.activeElement);Gn-=e;let i=R.padAxis(1),a=R.padAxis(0),o=0;if(R.padPressed(up.DOWN)||R.padPressed(up.RIGHT)?o=1:R.padPressed(up.UP)||R.padPressed(up.LEFT)?o=-1:Gn<=0&&(Math.abs(i)>.6||Math.abs(a)>.6)&&(o=(i||a)>0?1:-1,Gn=.22),o){let e=n[(r<0?o>0?-1:0:r)+o<0?n.length-1:((r<0?o>0?-1:0:r)+o)%n.length];e.focus(),e.classList.add(`pad-focus`),n.forEach(t=>t!==e&&t.classList.remove(`pad-focus`))}R.padPressed(up.A)&&r>=0&&n[r].click(),(R.padPressed(up.B)||R.padPressed(up.START))&&R.onPause()}function qn(e){if(Tn.t>=1)return;Tn.t=Math.min(1,Tn.t+e/.6);let t=$m(0,1,Tn.t);d.position.lerpVectors(Tn.pos,d.position,t),d.quaternion.slerpQuaternions(Tn.q,d.quaternion.clone(),t),d.fov=Tn.fov+(d.fov-Tn.fov)*t,d.updateProjectionMatrix()}$(`btn-settings`).onclick=()=>ke(!0);let Jn=!1;$(`btn-settings2`).onclick=()=>{Jn=!0,$(`pause`).classList.add(`hidden`),ke(!0)},$(`btn-close-drawer`).onclick=()=>{ke(!1),Jn&&B===`paused`&&Ne(`playing`),Jn=!1},$(`btn-pause`).onclick=()=>Ne(Et.inRoom?`lobby`:`paused`),$(`btn-weather`).onclick=Yt,$(`btn-mute`).onclick=Xt,$(`btn-resume`).onclick=()=>Ne(`playing`),$(`btn-reset`).onclick=()=>{q?(Ne(`playing`),ft()):(A(),_r=!1,Ne(`playing`))},$(`btn-menu`).onclick=()=>{dt(),Ne(`menu`)},$(`btn-quit`).onclick=()=>{dt(),Ne(`modes`),bt()},R.onPause=()=>{Oe.classList.contains(`open`)?ke(!1):B===`garage`?(Re(),Ne(We)):B===`modes`||B===`levels`?Ne(`menu`):B===`intro`?jt():B===`opening`?zt(!0):Et.inRoom?Ne(B===`lobby`?`playing`:`lobby`):B===`lobby`?Ne(`menu`):B===`playing`?Ne(`paused`):B===`paused`&&Ne(`playing`)},R.onKey=e=>{if(B===`intro`&&!/^(Shift|Control|Alt|Meta)/.test(e))return jt(),!0;if(B===`opening`&&!/^(Shift|Control|Alt|Meta)/.test(e))return zt(!0),!0;if(B===`playing`&&!Et.inRoom){let t={Digit1:`2H`,Digit2:`4H`,Digit3:`4L`,Digit4:`AWD`};if(t[e])return ye(t[e]),!0;if(e===`KeyQ`){let e=[`A`,`D`,`N`,`R`,`P`];return ve(e[(e.indexOf(E.sel)+1)%e.length]),!0}}if(B===`garage`){if(e===`ArrowLeft`||e===`KeyA`)return Ie(-1),!0;if(e===`ArrowRight`||e===`KeyD`)return Ie(1),!0;if(e===`Enter`)return $(`btn-play`).click(),!0}if(B!==`playing`&&B!==`paused`)return!1;if(e===`KeyT`)return Yt(),!0;if(e===`KeyH`&&q)return ot(),!0;if(e===`KeyG`&&Et.inRoom)return $(`btn-wp`).click(),!0;if(e===`KeyM`)return Xt(),!0;if(e===`Slash`&&Zt&&Qt){let e=Qt.body.translation(),t=Qt.forward();return Qt.reset(e.x,wd(e.x,e.z)+Qt.spawnLift,e.z,Math.atan2(t.x,t.z)),!0}return R.isBound(`camera`,e)&&!Zt?(Nn(),!0):R.isBound(`camreset`,e)&&!Zt?(Pn(),!0):!1},R.onReset=()=>{if(B!==`playing`)return;if(Et.inRoom){Et.requestReset();return}if(q){ft();return}let e=E.body.translation(),t=E.forward();A(e.x,e.z,Math.atan2(t.x,t.z))},document.querySelectorAll(`#seg-preset button`).forEach(e=>e.onclick=()=>{n.preset=e.dataset.v,Cp(n),pe(n.preset),Me()}),document.querySelectorAll(`#seg-ctrl button`).forEach(e=>e.onclick=()=>{n.controls=e.dataset.v,Cp(n),xe=!1,n.controls===`tilt`&&R.requestTilt().then(()=>Me()),Me()}),$(`rng-wsens`).oninput=e=>{n.wheelSens=Number(e.target.value),R.wheelSens=n.wheelSens,Cp(n)},$(`chk-auto`).onchange=e=>{n.autoThrottle=e.target.checked,Cp(n),Me()},document.querySelectorAll(`#seg-touch button`).forEach(e=>e.onclick=()=>{n.touch=e.dataset.v,Cp(n),Me()}),document.querySelectorAll(`#seg-weather button`).forEach(e=>e.onclick=()=>{n.weather=e.dataset.v,Cp(n),me(n.weather)}),$(`chk-fps`).onchange=e=>{n.showFps=e.target.checked,Cp(n),Me()},$(`rng-camdist`).oninput=e=>{n.camDist=Number(e.target.value),Cp(n)},$(`rng-camheight`).oninput=e=>{n.camHeight=Number(e.target.value),Cp(n)},document.querySelectorAll(`#seg-shake button`).forEach(e=>e.onclick=()=>{n.shakeUser=!0,n.shakeLevel=e.dataset.v,n.shake=n.shakeLevel!==`off`,Cp(n),Me()}),$(`chk-intro`).onchange=e=>{n.intro=e.target.checked,Cp(n)},$(`chk-mute`).onchange=e=>{n.muted=e.target.checked,Cp(n),a.setVolume(n.volume,n.muted),Me()},$(`rng-volume`).oninput=e=>{n.volume=Number(e.target.value),Cp(n),a.setVolume(n.volume,n.muted)},document.addEventListener(`visibilitychange`,()=>{document.hidden&&(R.clearTouch(),B===`playing`&&!Et.inRoom&&Ne(`paused`))});let Yn=0,Xn=0,Zn=null,Qn=0,$n=0;function er(e){e.addEventListener(`webglcontextlost`,t=>{t.preventDefault(),e===o&&($(`gl-lost`).classList.remove(`hidden`),B===`playing`&&Ne(`paused`))}),e.addEventListener(`webglcontextrestored`,()=>{$(`gl-lost`).classList.add(`hidden`)}),e.addEventListener(`pointerdown`,t=>{B===`intro`?jt():B===`opening`?zt(!0):(Zn=t.pointerId,Qn=t.clientX,$n=t.clientY,e.setPointerCapture(t.pointerId))}),e.addEventListener(`pointermove`,e=>{Zn===e.pointerId&&(yn===`orbit`?(bn-=(e.clientX-Qn)*.008,xn=Math.max(.05,Math.min(1.2,xn+(e.clientY-$n)*.005)),Sn=0,Qn=e.clientX,$n=e.clientY):(Yn-=(e.clientX-Qn)*.006,Xn=Math.max(-.3,Math.min(.6,Xn+(e.clientY-$n)*.004)),Qn=e.clientX,$n=e.clientY))});let t=e=>{Zn===e.pointerId&&(Zn=null)};e.addEventListener(`pointerup`,t),e.addEventListener(`pointercancel`,t)}pe(n.preset),L();let tr=[0,0,0,0],nr=[!1,!1,!1,!1],rr=new X(3022868),ir=new X(14201978),ar=new X(9073752),or=new X(10196622),sr=new X(7236196),cr=new X(7168592),ur=new K,dr=new K,fr=new K,pr=new K;function mr(e){let t=gp[F],n=E.body.linvel(),r=Math.hypot(n.x,n.z);E.forward(fr),pr.set(fr.z,0,-fr.x);for(let i=0;i<4;i++){let o=E.contact[i];if(!o){nr[i]=!1;continue}let s=E.surfaces[i],c=E.slip[i],l=i>=2,u=i%2==0?1:-1;if(E.inPuddle[i]&&!nr[i]&&r>2){a.splash(Math.min(1.5,r/12));for(let e=0;e<40*j.budget;e++)ur.set(n.x*.35+pr.x*u*(1+Math.random()*3)+(Math.random()-.5)*2,2+Math.random()*3+r*.15,n.z*.35+pr.z*u*(1+Math.random()*3)+(Math.random()-.5)*2),M.emit(o,ur,1.1,.16,.4,cr,.6)}nr[i]=E.inPuddle[i];let d=0;E.inPuddle[i]?d=r>1.2?r*9+c*40:0:s===`mud`?d=c*110+r*(l?5:2.5):s===`sand`?d=c*70+r*3.5:s===`rock`?d=c*45+(r>3?r*1.1:0)*(l?1:.5):t.dust>0&&r>6&&(d=(r-6)*1.4*t.dust*(l?1:.4)),tr[i]+=d*j.budget*e;let f=0;for(;tr[i]>=1&&f++<30;)if(--tr[i],dr.copy(o).addScaledVector(fr,-.3),E.inPuddle[i])ur.set(-fr.x*1.5+pr.x*u*Math.random()*2.5+n.x*.3,1.5+Math.random()*2.5+r*.12,-fr.z*1.5+pr.z*u*Math.random()*2.5+n.z*.3),M.emit(dr,ur,.9,.14,.5,cr,.5);else if(s===`mud`){let e=1+c*6;ur.set(-fr.x*e+pr.x*u*Math.random()*1.6+n.x*.45,1.2+Math.random()*(2+c*3),-fr.z*e+pr.z*u*Math.random()*1.6+n.z*.45),j.emit(dr,ur,1.2,.09+Math.random()*.1,.2,rr,.35)}else{let e=s===`sand`?ir:s===`rock`?or:ar;ur.set(-fr.x*(.5+c*3)+(Math.random()-.5)*1.5+n.x*.15,.4+Math.random()*.9,-fr.z*(.5+c*3)+(Math.random()-.5)*1.5+n.z*.15),te.emit(dr,ur,s===`sand`?2.4:1.8,s===`sand`?1.1:.8,2.6,e,.5),s===`rock`&&Math.random()<.25+c&&(ur.set(-fr.x*(1.5+c*4)+(Math.random()-.5)*2+n.x*.3,.8+Math.random()*1.8,-fr.z*(1.5+c*4)+(Math.random()-.5)*2+n.z*.3),j.emit(dr,ur,.7,.05+Math.random()*.05,0,sr,.25)),s===`sand`&&c>.15&&Math.random()<c&&(ur.set(-fr.x*(2+c*4)+n.x*.3,1+Math.random()*2,-fr.z*(2+c*4)+n.z*.3),j.emit(dr,ur,.8,.06,0,ir,.3))}}}let hr=new K,gr=new K,_r=!1,vr=0,yr=0,br=0,xr=performance.now(),Sr=0,Cr=0,wr=.5,Tr=null;k=()=>{Tr=null,wr=.4};let Er=0,Dr=0,Or=0,kr=[],Ar=Qm,jr=1/60,Mr=new K,Nr=new K,Pr=new K,Fr=new K,Ir=new K,Lr=new G,Rr=0,zr=0,Br=0;function Vr(t,r,i,a){let o=E.body.linvel(),s=Math.hypot(o.x,o.z),c=E.forwardSpeed(),l=i-vr;l=Math.atan2(Math.sin(l),Math.cos(l)),vr+=l*Math.min(1,t*(2.5+s*.08)),Zn===null&&(Yn*=Math.max(0,1-t*1.5),Xn*=Math.max(0,1-t*1.5));let u=vr+Yn+wn*Math.PI;yr+=(+!!Y-yr)*Math.min(1,t*2);let f=yn===`far`?1.55:1,p=E.spec.chassis,m=E.spec.cabin,h=(3.2+p.hz*1.9)*f,g=(1.5+(m.y+m.hy)*1)*(f>1?1.45:1);Br+=(ze.clamp(E.accLocal.y*.06,-.7,.9)*In()-Br)*Math.min(1,t*3);let _=(h+Math.min(3,Math.abs(c)*.085)+Br)*n.camDist+yr*3.2,v=(g+Math.min(.9,s*.03))*n.camHeight+Xn*6+yr*3.4;Pr.set(r.x,r.y+1.6,r.z),Nr.set(r.x-Math.sin(u)*_,r.y+v,r.z-Math.cos(u)*_);for(let e of[.35,.65,1]){let t=Pr.x+(Nr.x-Pr.x)*e,n=Pr.z+(Nr.z-Pr.z)*e,r=Pr.y+(Nr.y-Pr.y)*e,i=wd(t,n)+.9;r<i&&(Nr.y+=(i-r)/e)}Fr.subVectors(Nr,Pr);let y=Fr.length();Fr.divideScalar(y);let b=J?.body,x=S.castRay(new e.Ray(Pr,Fr),y,!0,void 0,void 0,void 0,E.body,b?e=>e.parent()?.handle!==b.handle:void 0),C=!1;x&&x.timeOfImpact<y&&(Nr.copy(Pr).addScaledVector(Fr,Math.max(1.2,x.timeOfImpact-.35)),C=!0),(a||!_r)&&(hr.copy(Nr),vr=i,_r=!0);let w=C&&Nr.distanceToSquared(Pr)<hr.distanceToSquared(Pr);hr.lerp(Nr,1-Math.exp(-t*(w?18:6))),Ir.set(r.x+o.x*.12,r.y+1.1,r.z+o.z*.12),gr.lerp(Ir,1-Math.exp(-t*10)),d.position.copy(hr),d.lookAt(gr);let T=Math.abs(o.y-Rr)/Math.max(t,.001);Rr=o.y;let D=E.surface(),O=(D===`rock`?.022:D===`ground`?.008:D===`mud`?.012:.006)*Math.min(1,s/12),ee=a?0:Math.min(.2,Math.max(0,T-4)*.006+O+Ln*.08)*In();zr+=(ee-zr)*Math.min(1,t*(ee>zr?20:4)),zr>.002&&(d.position.x+=(Math.sin(Cr*37.1)+Math.sin(Cr*23.7))*zr*.5,d.position.y+=(Math.sin(Cr*41.3)+Math.sin(Cr*29.9))*zr*.5,d.rotateZ(Math.sin(Cr*19.3)*zr*.08));let k=I+Math.min(14,Math.abs(c)*.45);d.fov+=(k-d.fov)*Math.min(1,t*3),d.updateProjectionMatrix()}function Hr(e,t){let n=At,r=Math.sin(t),i=Math.cos(t),a=i,o=-r,s=(t,n,s)=>new K(e.x+r*t+a*n,e.y+s,e.z+i*t+o*n);if(n<3.2){let t=$m(0,3.2,n),r=s(80,-50,30),i=s(14,-7,3.2);d.position.lerpVectors(r,i,t),d.lookAt(e.x,e.y+.8,e.z)}else if(n<6.2){let r=(n-3.2)/3,i=t+.45+r*1.7,a=6.2-r*.6;d.position.set(e.x+Math.sin(i)*a,e.y+1+r*.4,e.z+Math.cos(i)*a),d.lookAt(e.x,e.y+.6,e.z),$(`intro-name`).parentElement.classList.add(`show`)}else{let a=$m(6.2,kt,n),o=t+2.15,s=5.6,c=new K(e.x+Math.sin(o)*s,e.y+1.4,e.z+Math.cos(o)*s),l=new K(e.x-r*7.4,e.y+2.7,e.z-i*7.4);d.position.lerpVectors(c,l,a),d.lookAt(e.x,e.y+.6+a*.5,e.z),n>6.6&&$(`intro-name`).parentElement.classList.remove(`show`)}d.fov=I,d.updateProjectionMatrix()}function Ur(e){let t=Math.min(.5,Math.max(0,(e-xr)/1e3)),r=Math.min(.1,(e-xr)/1e3);if(xr=e,Cr+=r,Er++,Dr+=r,Dr>=1&&(Or=Er/Dr,kr.push(Or),kr.length>120&&kr.shift(),Er=0,Dr=0,$(`hud-fps`).textContent=Or.toFixed(0)+` fps`),Kn(r),Et.inRoom){let e=B===`playing`?R.read(r):Qm;Ar=e,Et.frame(t,e)}else if(B!==`paused`){let e=B===`playing`?R.read(r):B===`opening`?R.override??Bt():R.override??Qm;Ar=e,$t=Zt&&B===`playing`?R.readP2(r):Qm,br+=r;let t=0;for(;br>=jr&&t<8;)lt(e),br-=jr,t++;t===8&&(br=0)}{let e=R.touchActive&&R.scheme===`wheel`;E.wheelDegOverride=e?R.wheelDeg:null,Qt&&(Qt.wheelDegOverride=R.touchActive?R.p2wheel.wheelDeg:null)}E.sync(),Qt&&Qt.sync();{let e=E.body.linvel();if(Tr&&B!==`paused`&&wr<=0){let t=Math.hypot(e.x-Tr.x,(e.y-Tr.y)*.6,e.z-Tr.z);t>3.2&&(a.impact((t-3.2)/6),wr=.25,Ln=Math.min(1,Ln+(t-3.2)/5),R.lastDevice===`pad`&&R.rumble((t-3.2)/5))}wr-=r,Tr={x:e.x,y:e.y,z:e.z}}if(Et.afterSync(r),(B===`playing`||B===`opening`)&&mr(r),B!==`paused`)for(let e of P)e.update(r,wd);let i=E.group.position;E.forward(Mr);let c=Math.atan2(Mr.x,Mr.z);if(B===`menu`||B===`modes`||B===`levels`||B===`lobby`&&!Et.inRoom){Sr+=r*.15;let e=window.innerWidth<window.innerHeight;if(Vt(i,c,Sr,Ht,Gt),Lt<1){Lt=Math.min(1,Lt+r*.8);let e=$m(0,1,Lt);d.position.lerp(Ht,e),gr.lerp(Gt,e)}else d.position.copy(Ht),gr.copy(Gt);d.lookAt(gr),e||d.translateX(-2.2*(Lt<1?$m(0,1,Lt):1)),d.fov=I,d.updateProjectionMatrix(),_r=!1}else if(B===`garage`){Ve=He??Ve+r;let e=c+.9+Ve*.32,t=6.5+E.spec.chassis.hz*.9,n=window.innerWidth<window.innerHeight;d.position.set(i.x+Math.sin(e)*t,i.y+1.6+Math.sin(Ve*.4)*.4,i.z+Math.cos(e)*t),d.lookAt(i.x,i.y+(n?-1.6:.4),i.z),n||d.translateX(window.innerHeight<480?2.6:2.4),d.fov=I-4,d.updateProjectionMatrix(),_r=!1}else B===`opening`?(Pt+=r,Jt(i,c,r),Pt>=Nt&&zt(!1)):B===`intro`?(At+=r,Hr(i,c),At>=kt&&jt()):(Vr(r,i,c,!1),!jn(yn)&&!Zt&&(B===`playing`||B===`paused`)?Vn(r):(wn+=(+!!Cn-wn)*Math.min(1,r*9),d.near!==.1&&(d.near=.1,d.updateProjectionMatrix())),qn(r),Ln=Math.max(0,Ln-r*2.5),Zt&&Qt&&fn(r));p.position.set(i.x+oe.x*120,i.y+oe.y*120,i.z+oe.z*120),p.target.position.copy(i),h.position.copy(d.position),g.position.copy(d.position);{let e=gp[F];Mr.subVectors(d.position,i),Mr.y=0,Mr.normalize(),_.position.set(i.x+Mr.x*4.5,i.y+2.6,i.z+Mr.z*4.5),v.position.set(i.x-Mr.x*4.5,i.y+2.2,i.z-Mr.z*4.5),_.intensity=y?e.fill:0,v.intensity=y?e.rim:0;let t=B===`garage`;E.setEnv(t||!le?D:le.texture,t?1:e.env*1.5),t&&(E.dirt=0),Qt?.setEnv(le?le.texture:D,e.env*1.5),b.intensity=t?260:0,x.intensity=t?200:0,t&&(b.position.set(i.x+Math.sin(c+.8)*7,i.y+6,i.z+Math.cos(c+.8)*7),b.target.position.copy(i),x.position.set(i.x+Math.sin(c+3.6)*7,i.y+4,i.z+Math.cos(c+3.6)*7),x.target.position.copy(i))}if(E.wet=+(F===`rain`),Qt&&(Qt.wet=E.wet),ae.update(Cr,d.position),ne.update(d,-6),(B===`playing`||B===`opening`||B===`menu`)&&F!==`rain`&&F!==`fog`){let e=xd(i.x,i.z)===`sand`||xd(i.x+12,i.z-6)===`sand`;for(ie+=e?r*70*wp[n.preset].particles:0;ie>=1;){ie--;let e=(Math.random()-.5)*36-10,t=(Math.random()-.5)*36-4,n=i.x+e,r=i.z+t;xd(n,r)===`sand`&&(Xm.set(n,wd(n,r)+.05+Math.random()*.6,r),Zm.set(6.5+Math.random()*3,.4+Math.random()*.5,2.2+Math.random()*1.5),N.emit(Xm,Zm,1.6+Math.random()*1.4,.18+Math.random()*.2,1.8,Ym,.4))}}vu.uTime.value=Cr,Iu(d.position),s.getDrawingBufferSize(Lr);let u=Lr.y/(2*Math.tan(d.fov*Math.PI/360));for(let e of P)e.uniforms.uScale.value=u;let f={ground:0,mud:0,sand:0,rock:0},m=0;for(let e of E.surfaces)e&&(f[e]++,m++);let S=(E.slip[0]+E.slip[1]+E.slip[2]+E.slip[3])/4;if(a.update({rpm:E.rpm,throttle:B===`paused`?0:E.throttle,speed:E.forwardSpeed(),mud:m?f.mud/4:0,sand:m?f.sand/4:0,ground:m?f.ground/4:0,rock:m?f.rock/4:0,slip:S,active:B===`playing`||B===`intro`||B===`opening`,weather:F}),B===`playing`||B===`paused`){{let e=E.body.linvel();$(`hud-speed`).textContent=Math.round(Math.hypot(e.x,e.y,e.z)*3.6).toString()}$(`hud-gear`).textContent=E.sel===`P`?`P`:E.sel===`N`?`N`:E.gear<0?`R`:(E.sel===`D`?`D`:``)+String(E.gear),R.touchActive&&($(`pd-gas`).querySelector(`.fill`).style.height=`${Math.round(R.gasV*100)}%`,$(`pd-brake`).querySelector(`.fill`).style.height=`${Math.round(R.brakeV*100)}%`);{let e=E.surfaces.filter(Boolean).length,t=(E.slip[0]+E.slip[1]+E.slip[2]+E.slip[3])/4,n=$(`hud-trac`),r=e===0?[`Airborne`,`air`]:E.transfer===`4L`&&t<.25?[`Low range`,`ok`]:t>.45?[`Wheelspin`,`bad`]:t>.2?[`Slipping`,`warn`]:[`Grip`,`ok`];n.textContent=r[0]+(e&&e<4?` · ${e}/4`:``),n.className=`chip trac `+r[1]}let e=E.surface(),t=$(`hud-surface`);t.textContent=Df[e].label+(E.inPuddle.some(Boolean)?` · water`:``),t.className=`chip `+e}wt(r),U&&(d.position.copy(E.group.localToWorld(new K(...U[0]))),d.lookAt(E.group.localToWorld(new K(...U[1])))),W&&(d.position.set(...W[0]),d.lookAt(new K(...W[1]))),o.classList.toggle(`mirrored`,yn===`mirror`&&!Zt&&(B===`playing`||B===`paused`)),Zt&&Qt&&(B===`playing`||B===`paused`)?pn():s.render(l,d),requestAnimationFrame(Ur)}window.__net={get status(){return Et.net.status},get rtt(){return Et.net.rtt},get room(){return Et.room},get myId(){return Et.myId},get inRoom(){return Et.inRoom},get metrics(){return Et.metrics},get interpDelay(){return Et.interpDelay},get reconnects(){return Et.net.reconnects},get lastErr(){return Et.lastErr},get url(){return Et.net.url},get bytesIn(){return Et.net.bytesIn},get seq(){return[Et.seq,Et.lastAck,Et.histFirst()]},quick:e=>Et.quick(e),create:e=>Et.create(e),join:e=>Et.join(e),leave:()=>Et.leave(),startRace:()=>Et.startRace(),setWaypoint:(e=!1)=>Et.setWaypoint(e),drop:()=>Et.net.dropConnection(),sendRaw:e=>Et.net.sendRaw(e),setPilot:e=>Et.setPilot(e),drive:()=>{Ne(`playing`),_r=!1},own:()=>{let e=E.body.translation();return{x:e.x,y:e.y,z:e.z,vx:E.group.position.x,vz:E.group.position.z}},remotes:()=>[...Et.remotes.values()].map(e=>({id:e.id,name:e.name,away:e.away,x:e.vis.p.x,y:e.vis.p.y,z:e.vis.p.z,visible:e.v.group.visible,tag:e.tag.textContent})),lobbyNames:()=>[...document.querySelectorAll(`#lb-players li b`)].map(e=>e.textContent),resetMetrics:()=>{let e=Et.metrics;e.corrections=e.hardSnaps=e.maxErr=e.maxVisOff=e.extrap=e.replaySteps=0,e.errs.length=e.corrErrs.length=e.remoteJerk.length=e.ownJerk.length=0,e.snaps=0}},window.__game={get phase(){return B},play:()=>$(`btn-play`).click(),skipIntro:()=>jt(),state:()=>{let e=E.body.translation(),t=E.body.linvel(),r=E.forward();return{x:e.x,y:e.y,z:e.z,yaw:Math.atan2(r.x,r.z),up:E.group.up.clone().applyQuaternion(E.group.quaternion).y,speed:E.forwardSpeed(),hspeed:Math.hypot(t.x,t.z),surface:E.surface(),wheels:E.surfaces.slice(),slip:E.slip.slice(),puddle:E.inPuddle.slice(),rpm:E.rpm,gear:E.gear,fps:Or,fpsHistory:kr.slice(),tracks:C.count,input:Ar,renderer:{...s.info.render},preset:n.preset,weather:F,aa:!!s.getContext().getContextAttributes()?.antialias,particles:{mud:j.active,dust:te.active,splash:M.active,spawned:j.spawned+te.spawned+M.spawned},audio:{state:a.state,engineHz:a.engineHz},camera:{fov:d.fov,x:d.position.x,y:d.position.y,z:d.position.z},introT:At}},measureEngineHz:()=>a.measureEngineHz(),get vehicle(){return{id:E.spec.id,name:E.spec.name,paint:E.paint.color.getHex(),spawnLift:E.spawnLift,lod:E.lod,dirt:E.dirt}},carStats:()=>E.modelStats(),get save(){return JSON.parse(JSON.stringify(r))},saveKey:Kp,migrate:e=>em(e),medalFor:(e,t)=>Hp(e,Um(t).targets),missions:Bp.map(e=>({id:e.id,mode:e.mode,type:e.type,start:e.start,gates:e.gates,zone:e.zone??null,stuck:e.stuck??null,limit:e.limit,targets:e.targets,reward:e.reward,laps:e.laps??1,noReset:!!e.noReset})),levels:Wm.map(e=>({...e})),levelMissions:Hm.map(e=>({id:e.id,type:e.type,start:e.start,gates:e.gates,zone:e.zone??null,limit:e.limit,targets:e.targets,reward:e.reward,weather:e.weather??null,maxResets:e.maxResets??null,stuckFail:e.stuckFail??null})),levelState:()=>Wm.map(e=>({n:e.n,status:e.status,done:Gm(r.best,e),unlocked:Km(r.best,e,rm())})),openLevels:()=>yt(),get forcedWeather(){return Qe},botTimes:Ip,medalFactors:Lp,towRule:{margin:2,hold:1},startMission:e=>ut(e),endMission:()=>{dt(),Ne(`menu`)},skipCountdown:()=>{q&&q.state===`countdown`&&(q.countdown=1e-4)},get mission(){if(!q)return null;let e=q;return{id:e.def.id,state:e.state,t:e.t,next:e.next,splits:e.splits.slice(),rejected:e.rejected,resets:e.resets,msg:e.msg,log:e.log.slice(),attached:e.attached,reached:e.reached,failReason:e.failReason,countdown:e.countdown,ropeLen:Y?Ke:0}},missionReset:()=>ft(),hook:()=>ot(),winch:e=>{qe=e},stuckPos:()=>{if(!J)return null;let e=J.body.translation();return{x:e.x,y:e.y,z:e.z,surface:J.surface()}},get results(){return Xe},addCredits:(e,t=0)=>{r.credits+=e,r.xp+=t,nm(r),Me()},unlockVehicle:e=>Le(e),buyUpgrade:(e,t)=>H(e,t),get dev(){return rm()},setPaint:e=>E.setPaint(e),setDirt:e=>{E.dirt=e},suspSample:()=>{E.sync();let e=E.group;e.updateMatrixWorld(!0);let t=[];return e.traverse(e=>{if(e.isInstancedMesh){let n=new st;for(let r=0;r<e.count;r++)e.getMatrixAt(r,n),t.push(n.elements.slice(12,15).concat([new K().setFromMatrixScale(n).y,new Be().setFromRotationMatrix(n).z]))}}),{hubs:E.wheelMeshes.map(e=>[e.position.x,e.position.y,e.position.z,e.rotation.y,e.children[0].rotation.x]),inst:t}},get spec(){return E.spec},vehicles:np.map(e=>e.id),setVehicle:e=>{n.vehicle=e,Cp(n),V(e)},split:{start:()=>cn(),stop:()=>{ln(),Ne(`menu`)},get on(){return Zt},setP2:e=>{R.override2=e},p2:()=>{if(!Qt)return null;let e=Qt.body.translation();return{x:e.x,y:e.y,z:e.z,speed:Qt.forwardSpeed(),steer:Qt.steer,input:$t,p1input:Ar}}},testPad:()=>{if(!window.__pad0){let t=S.createRigidBody(e.RigidBodyDesc.fixed());S.createCollider(e.ColliderDesc.cuboid(150,1,1e3).setTranslation(-400,399,0),t),window.__pad0=!0}return{x:-400,y:400,z:-950}},place:(e,t,n,r)=>{E.reset(e,t,n,r),_r=!1},speedMode:e=>Hn(e,!0),get capKmh(){return E.capKmh},profile:e=>mn(e,!0),get profileId(){return E.profile.id},profileIds:hf,cam:e=>Mn(e),get camMode(){return yn},camModes:gn,resetCam:()=>Pn(),lookBack:e=>{Cn=e},input:{get last(){return R.lastDevice},get pad(){return{index:R.padIndex,name:R.padName}},bindings:()=>JSON.parse(JSON.stringify(R.bindings)),setBinding:(e,t)=>R.setBinding(e,t),resetBindings:()=>R.resetBindings()},camInfo:()=>{let e=d.position,t=wd(e.x,e.z),n=E.body.translation();return{mode:yn,x:e.x,y:e.y,z:e.z,aboveGround:e.y-t,distToCar:e.distanceTo(new K(n.x,n.y,n.z)),fov:d.fov,blend:Tn.t,lookBackK:wn,head:{x:Rn.x,y:Rn.y,z:Rn.z},vib:Bn,cineSide:!!En.side}},orbit:(e,t=.35)=>{bn=e,xn=t,Sn=0},wheelAngle:()=>E.steeringWheel?.rotation.z??null,wheelUI:()=>({deg:R.wheelDeg,held:R.wheelHeld,value:R.wheelValue,steer:Ar.steer,p2deg:R.p2wheel.wheelDeg,p2angle:Qt?.steeringWheel?.rotation.z??null}),camOverride:e=>{U=e},camWorld:e=>{W=e},garageHold:e=>{He=e},setFill:e=>{y=e;let t=gp[F];_.intensity=e?t.fill:0,v.intensity=e?t.rim:0},carLuma:(e=.05)=>{s.render(l,d);let t=s.getContext(),n=t.drawingBufferWidth,r=t.drawingBufferHeight,i=E.group.position.clone().add(new K(0,.6,0)).project(d),a=Math.round((i.x*.5+.5)*n),o=Math.round((i.y*.5+.5)*r),c=Math.round(n*e),u=Math.round(r*e),f=new Uint8Array(c*2*u*2*4);t.readPixels(a-c,o-u,c*2,u*2,t.RGBA,t.UNSIGNED_BYTE,f);let p=0;for(let e=0;e<f.length;e+=4)p+=.2126*f[e]+.7152*f[e+1]+.0722*f[e+2];return p/(f.length/4)},setWeather:e=>{n.weather=e,me(e)},setInput:e=>{R.override=e},teleport:(e,t,n)=>{A(e,t,n),_r=!1},simulate:(e,t)=>{let n=Math.round(t/jr),r=[],i=E.body.translation(),a={x:i.x,z:i.z};for(let t=1;t<=n;t++)lt(e),t%30==0&&r.push({t:t*jr,speed:E.forwardSpeed(),surface:E.surface()});E.sync();let o=E.body.translation(),s=E.forward();return{yaw:Math.atan2(s.x,s.z),distance:Math.hypot(o.x-a.x,o.z-a.z),finalSpeed:E.forwardSpeed(),surface:E.surface(),trace:r}},zones:Uu,puddles:Sd,trees:Id,heightAt:wd,surfaceAt:xd,trail:$u.map(e=>({x:e.x,z:e.z,h:e.h,hw:e.hw})),hairpins:ed.map(e=>({...e})),get audioRock(){return a.rockLevel},controls:()=>({setting:n.controls,scheme:R.scheme,auto:n.autoThrottle,tiltState:R.tiltState,tiltEvents:R.tiltEvents,tilt:R.tiltValue,touchActive:R.touchActive,fallback:xe}),setControls:(e,t=!1)=>{n.controls=e,n.autoThrottle=t,xe=!1,Cp(n),Me()},readInput:()=>R.read(1/60),nature:()=>({...Lu(),counts:{...Ru}}),groundDetail:()=>zd.map(e=>`OW_DETAIL`in(e.defines??{})),skyEnv:()=>!!le,towOcclusion:()=>{if(!J)return null;let e=d.position,t=E.body.translation(),n=new K(t.x,t.y+1,t.z),r=J.body.translation(),i=n.clone().sub(e),a=Math.max(0,Math.min(1,new K(r.x,r.y+.8,r.z).sub(e).dot(i)/i.lengthSq()));return e.clone().addScaledVector(i,a).distanceTo(new K(r.x,r.y+.8,r.z))},placeStuck:(e,t,n)=>!J||!q?!1:(Y&&(S.removeImpulseJoint(Y,!0),Y=null,q.attached=!1),tt(J,{x:e,z:t,yaw:n}),J.sync(),!0),setPreset:e=>{n.preset=e,pe(e)},perfToggle:(e,t)=>{e===`ground`?bu(zd,t):e===`nature`?Pu(t?2:0):m.uniforms.uCloud.value=t?.5:0},screeCount:()=>nf.mesh?.count??0,get openT(){return Pt},skipOpening:()=>zt(!0),lean:()=>({...E.lean,braking:E.braking,tail:E.tailMat?.emissiveIntensity??0,acc:{lat:E.accLocal.x,lon:E.accLocal.y}}),camShake:()=>zr,impacts:()=>a.impacts,drive:()=>({sel:E.sel,transfer:E.transfer,modes:E.driveModes.slice(),wheelForce:E.wheelForce.slice(),wheelReq:E.wheelReq.slice(),wheelRate:E.wheelRate.slice(),ratio:E.ratio,engineForce:E.engineForce,frontSplit:E.spec.frontSplit??.5,gear:E.gear,rpm:E.rpm,steerAngle:E.steer,kmh:E.forwardSpeed()*3.6}),setGear:e=>ve(e),setTransfer:e=>ye(e),pedals:()=>({gas:R.gasV,brake:R.brakeV,wheelDeg:R.wheelDeg,wheel:R.wheelValue}),get dusk(){return{k:Ct,exposure:s.toneMappingExposure,sun:p.intensity}},flip:()=>{let e=E.body.translation(),t=E.body.rotation(),n=new Be(t.x,t.y,t.z,t.w).multiply(new Be().setFromAxisAngle(new K(0,0,1),Math.PI));E.body.setTranslation({x:e.x,y:e.y+1.8,z:e.z},!0),E.body.setRotation({x:n.x,y:n.y,z:n.z,w:n.w},!0),E.body.setLinvel({x:0,y:0,z:0},!0),E.body.setAngvel({x:0,y:0,z:0},!0)},pose:()=>{let e=ct(),t=E.body.translation();return{...e,y:t.y}},botRun:(e,t={})=>{if(!q)return null;q.state===`countdown`&&(q.countdown=1e-4);let n=q.def,r=!!t.human,i=(t.seed??1)*9301+49297,a=()=>(i=i*16807%2147483647,i/2147483647),o=n.path??[{x:n.start.x,z:n.start.z},...n.gates.map(e=>({x:e.x+Math.sin(e.yaw)*4,z:e.z+Math.cos(e.yaw)*4})),...n.zone?[n.zone]:[]],s=[0];for(let e=1;e<o.length;e++)s.push(s[e-1]+Math.hypot(o[e].x-o[e-1].x,o[e].z-o[e-1].z));let c=e=>{e=Math.min(s[s.length-1],Math.max(0,e));let t=1;for(;t<s.length-1&&s[t]<e;)t++;let n=(e-s[t-1])/(s[t]-s[t-1]||1);return{x:o[t-1].x+(o[t].x-o[t-1].x)*n,z:o[t-1].z+(o[t].z-o[t-1].z)*n}},l=0,u=(e,t)=>{let n=l,r=1/0;for(let i=Math.max(0,l-10);i<=Math.min(s[s.length-1],l+40);i+=1){let a=c(i),o=(a.x-e)**2+(a.z-t)**2;o<r&&(r=o,n=i)}return l=n,Math.sqrt(r)},d=0,f=0,p=ct(),m=0,h=0,g=0,_=0,v=0,y=[],b=0,x=0;for(let i=0;i<Math.round(e/jr)&&!q.finished&&!(t.untilAttached&&q.attached);i++){let e=ct(),o,S=30;if(n.type===`tow`&&J&&!q.attached){let n=J.body.translation(),i=J.forward();o={x:n.x+i.x*9,z:n.z+i.z*9},S=r?8:12,(Math.hypot(e.x-o.x,e.z-o.z)<4||it(E,nt()).distanceTo(it(J,rt()))<8)&&(v++,t.autoHook!==!1&&v>(r?90:0)&&ot())}else if(n.type===`tow`){let e=J.body.translation(),t=n.zone,i=t.x-e.x,a=t.z-e.z,s=Math.hypot(i,a)||1;o={x:t.x+i/s*12,z:t.z+a/s*12},S=s<2.5?0:s<6?3:r?5:7}else{let i=u(e.x,e.z);if(_=i>9||e.up<.4?_+jr:0,_>2&&!n.noReset&&q.state===`running`){ft(),_=0;let e=ct();l=0;let t=1/0;for(let n=0;n<=s[s.length-1];n+=2){let r=c(n),i=(r.x-e.x)**2+(r.z-e.z)**2;i<t&&(t=i,l=n)}i=Math.sqrt(t)}let a=(r?7:6)+Math.abs(e.speed)*(r?.45:.5);o=c(l+a);let d=0,f=12+Math.abs(e.speed)*1.6;for(let e=0;e<=f;e+=3){let t=c(l+e),n=c(l+e+6),r=c(l+e+12),i=Math.atan2(r.x-n.x,r.z-n.z)-Math.atan2(n.x-t.x,n.z-t.z);i=Math.abs(Math.atan2(Math.sin(i),Math.cos(i))),d=Math.max(d,i*(1-.35*e/f))}S=Math.max(r?4.2:4.8,(r?19:26)-d*(r?19:17)),i>6&&(S=Math.min(S,8)),n.zone&&(n.type===`deliver`||n.type===`trail`||t.slowZone)&&Math.hypot(n.zone.x-e.x,n.zone.z-e.z)<22&&l>s[s.length-1]-30&&(S=3)}n.type===`tow`&&q.attached&&(qe=Ke>4);let C=Math.atan2(o.x-e.x,o.z-e.z)-e.yaw;C=Math.atan2(Math.sin(C),Math.cos(C)),i%60==0&&(d=Math.hypot(e.x-p.x,e.z-p.z)<1&&q.state===`running`?d+1:0,p=e,d>=2&&(f=90,d=0));let w=e.speed<S?t.throttle??1:0,T=+(e.speed>S+(r?2.5:1)),D=Math.max(-1,Math.min(1,C*(r?1.7:2.2)));r&&(i%6==0&&(m=m*.7+(a()-.5)*.5,h=a(),g<=0&&a()<.03&&(g=20+a()*30)),y.push(D),D=y.length>15?y.shift():0,D=Math.max(-1,Math.min(1,D+m)),g>0&&(g--,w*=.3),w*=.8+h*.2,b+=(D-b)*.25,x+=(w-x)*.2,D=b,w=x),f>0&&(f--,w=0,T=1,D=-D),lt({throttle:w,brake:T,steer:D,handbrake:!1})}return qe=!1,E.sync(),J?.sync(),{state:q.state,t:q.t,next:q.next,splits:q.splits.slice(),failReason:q.failReason,rejected:q.rejected,attached:q.attached,resets:q.resets}}},Fe(),t(100,`Ready`),$(`btn-oskip`).onclick=()=>zt(!0),n.intro&&!/[?&]noopening/.test(location.search)?Rt():(B=`menu`,Me()),requestAnimationFrame(e=>{xr=e,Ur(e)})}export{eh as boot};