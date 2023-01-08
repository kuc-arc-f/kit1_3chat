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
console.log("id=", params.id);
  const validLogin: boolean = await LibAuth.validLogin();
  const user: any = await LibAuth.getUser();
console.log(user);
  const items = await getItem(Number(params.id));
//console.log(items);
  return {
      id: params.id,
      chat_posts: items,
      validLogin: validLogin,
      user: user,
  };  
//    throw error(404, 'Not found');
}
/*
*/