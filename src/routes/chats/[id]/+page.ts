import { error } from '@sveltejs/kit';
import LibConfig from '$lib/LibConfig';
import LibAuth from '$lib/LibAuth';
import LibDbSession from '$lib/LibDbSession';
//type
type IPostItem = {
  id: number,
  title : string,
  content : string,
  category : string,
  createdAt: string,
}
/**
* getItem
* @param
*
* @return
*/   
const getItem = async function(id: number) {
  try {   
    const item = {
      chatId: id,
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
    const chat_posts = json.data
    await LibDbSession.set(LibConfig.SESSION_KEY_CHAT_POST, chat_posts);
console.log(json)	
    return chat_posts;
  } catch (e) {
    console.error(e);
    alert("error, getItem");
  }
}
//
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
console.log("id=", params.id);
  const validLogin: boolean = await LibAuth.validLogin();
  const items = await getItem(Number(params.id));
console.log(items);
  return {
      id: params.id,
      chat_posts: items,
      validLogin: validLogin,
  };  
//    throw error(404, 'Not found');
}
/*
*/