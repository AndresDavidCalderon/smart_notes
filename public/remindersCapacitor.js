import { registerPlugin } from '@capacitor/core';

const echo = registerPlugin('echo');
const toast = registerPlugin('Toast');
export default echo;
console.log(await echo.echo({ value: 'hello!' }));
toast.show();
