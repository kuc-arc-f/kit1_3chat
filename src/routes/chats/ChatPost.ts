import LibDbSession from '$lib/LibDbSession';
import LibConfig from '$lib/LibConfig';
//
const ChatPost = {
  /**
   * getList:
   * @param key: any
   *
   * @return
   */ 
  getList: async function(chatId: number): Promise<any>
  {
    try {
        let items = [];
        const item = {
          chatId: chatId,
          userId : 0,
        }
        const url = LibConfig.API_URL + "/chat_posts/index";
        const body = JSON.stringify(item);
        const res = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},      
          body: body
        });
        const json = await res.json()  
        items = json.data
        await LibDbSession.set(LibConfig.SESSION_KEY_CHAT_POST, items);
//    console.log(json)	      
      return items;
    } catch (e) {
      console.error(e);
    }
  },
  /**
  * getLastTime
  * @param chatId: number
  *
  * @return Promise
  */      
  getLastTime : async function (chatId: number, userId: number): Promise<any>
  {
    try {
      let ret = {};
      const item = {
        chatId: chatId,
        userId: userId,
      }
       const res = await fetch(LibConfig.API_URL + '/chat_posts/get_last_time', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json',},
         body: JSON.stringify(item),
       });
       if (res.status != 200) {
         throw new Error(await res.text());
       }
       const json = await res.json();
       if(json.ret === LibConfig.OK_CODE) {
//console.log(json.data);
        ret = json.data;
      }
      return ret;       
    } catch (e) {
      console.log(e);
      throw new Error('error, getLastTime');
    }
   },
}
export default ChatPost;
