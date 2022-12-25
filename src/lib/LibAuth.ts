import LibDbSession from '$lib/LibDbSession';
import LibConfig from '$lib/LibConfig';
//
const LibAuth = {
  /**
   * validLogin:
   * @param key: any
   *
   * @return
   */ 
  validLogin: async function(): Promise<any>
  {
    try {
      let ret = false;
  console.log("testSet");
      const user = await LibDbSession.get(LibConfig.SESSION_KEY_USER);
console.log(user);
      if(user === null) {
        return ret;
      }
      ret = true;
      return ret;
    } catch (e) {
      console.error(e);
    }
  },

}
export default LibAuth;
