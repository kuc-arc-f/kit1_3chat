import { error } from '@sveltejs/kit';
import LibConfig from '$lib/LibConfig';
import LibAuth from '$lib/LibAuth';
import LibDbSession from '$lib/LibDbSession';
import ChatPost from '../ChatPost';
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
    const items = await ChatPost.getList(id);
    return items;
  } catch (e) {
    console.error(e);
  }
}
//
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  try{
    console.log("id=", params.id);
    const validLogin: boolean = await LibAuth.validLogin();
    const user: any = await LibAuth.getUser();
    const items = await getItem(Number(params.id));
console.log(items);
    let lastCreateTime = "";
    if(items.length > 0) {
      const post = items[0];
console.log("createdAt=", post.createdAt);
      lastCreateTime = post.createdAt;
    }
    return {
        id: params.id,
        chat_posts: items,
        validLogin: validLogin,
        user: user,
        lastCreateTime: lastCreateTime,
    };  
  } catch (e) {
    console.error(e);
    throw new Error('Error , delete_movie');
  }
//    throw error(404, 'Not found');
}
/*
*/