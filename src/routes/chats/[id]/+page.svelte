<svelte:head>
<title>Posts</title>
<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibConfig from '$lib/LibConfig';
import LibAuth from '$lib/LibAuth';
import LibCommon from '$lib/LibCommon';
import LibChatPost from '$lib/LibChatPost';
import LibTimer from '$lib/LibTimer';
import LibNotify from '$lib/LibNotify';
import LibCookie from '$lib/LibCookie';
import ChatPost from '../ChatPost';
import ModalPost from './ModalPost.svelte';
//
const postCfg= LibChatPost.get_params()
const chatParams = {
  INIT_TIME : new Date(),
  STAT : postCfg.STATE_ACTIVE,
  STAT_DISPLAY : postCfg.STATE_DISPLAY_ACTIVE,
  REMAIN_TIME : 0,
}
/** @type {import('./$types').PageData} */
export let data: any, chat_posts: any[] = [], DATA = chatParams,
post_id = 0, modal_display = false, mTimeoutId: any = 0, user:any = {}, lastCreateTime: string = "";
//
console.log("[id]start.id=", data.id);
user = data.user;
chat_posts = data.chat_posts;
//console.log(data);
lastCreateTime = data.lastCreateTime;
/**
* timer_func
* @param
*
* @return
*/  
const timer_func = async function(){
  const sec = LibChatPost.get_remain_time(DATA.INIT_TIME, new Date() )
  const valid = LibChatPost.valid_update(sec, DATA.STAT)
  DATA.REMAIN_TIME = LibChatPost.get_next_time(sec)
  const timeoutId = LibTimer.getTimeoutId();
//console.log("timeoutId=", timeoutId);
  if(valid){
    DATA.INIT_TIME = new Date()
console.log("uid=", user.id);
    proc_update(Number(data.id), user.id)
  }
  timeout_next();
  if(typeof window !== 'undefined' ){
    console.log(DATA.STAT, sec, valid);
  }
};
/**
* timeout_next
* @param
*
* @return
*/
function timeout_next(){
  mTimeoutId = setTimeout(timer_func, 5000 );
  LibTimer.setTimeoutId(mTimeoutId);
}
/**
* proc_update
* @param
*
* @return
*/
const proc_update = async function (chatId: number, userId: number)
{
    try{
        const post: any = await ChatPost.getLastTime(chatId, userId);
//console.log(post);
//console.log("lastCreateTime=", lastCreateTime);
        let items = [];
        if(lastCreateTime !== post.createdAt) {
            //update
            items = await ChatPost.getList(chatId);
//console.log(items);
            lastCreateTime = post.createdAt;
            chat_posts = items;
            //beep
            if(items !== null && items.length > 0) {
                const item: any = items[0];
console.log(item.body, item.UserName, item.createdAt);
                sendNotify(item.UserName, item.body);
                setTimeout(async () => {
                    console.log("#sound start");
                    await beepStart();
                }, 1000);                
            }
        }
    } catch (e) {
        console.error(e);
        throw new Error('Error , proc_update');
    }
}
/**
* init proc: 開始
* @param
*
* @return
*/
if(data.validLogin === false) {
    window.location.href = '/login';
}
if(typeof window !== 'undefined' ) {
    const key = LibConfig.COOKIE_KEY_LAST_CHAT;
console.log("#init proc", key);
    LibCookie.setCookie(key, String(data.id));
}
//
LibNotify.validNotification();
//
const timeoutId = LibTimer.getTimeoutId();
if(timeoutId !== null) {
  LibTimer.clearTimer(timeoutId);
}
timeout_next()
/**
* addItem
* @param
*
* @return
*/
async function addItem(){
    try {
        const user = await LibAuth.getUser()
        if(user === null) {
            console.error("addPost, user nothing");
            throw new Error('Error , user nothing');
        }
//console.log(user);
        const elemBody = document.querySelector<HTMLInputElement>('#body');
        const item = {
            title: '',
            chatId: Number(data.id),
            body: elemBody?.value,
            userId : Number(user.id),
        }
        console.log(item);
        const url = LibConfig.API_URL + '/chat_posts/create';
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify(item),
        });
        if (res.status != 200) {
            throw new Error(await res.text());
        }
        //@ts-ignore
        elemBody.value = "";
        const resJson = await res.json();
        console.log(resJson.data)
        const items = await ChatPost.getList(data.id);
        chat_posts = items;
        lastCreateTime = resJson.data.createdAt;
    } catch (error) {
        console.error(error);
    }    
}
/**
 * parentShow
 * @param
 *
 * @return
 */
const parentShow = function (id: number)
{
    try {
        post_id = id;
        modal_display = false;
        const timer = 100;
        setTimeout(() => {
            console.log("parentShow=", id);
            modal_display = true;
            const btn = document.getElementById("open_post_show");
            btn?.click();
        }
        , timer);
    } catch (e) {
        console.log(e);
    }
}
/**
 * parentGetList
 * @param
 *
 * @return
 */
const parentGetList = async function (id: number) {
    try {
        const items = await ChatPost.getList(Number(data.id));
        chat_posts = items;
    } catch (e) {
        console.error(e);
    }    
}
/**
 * sendNotify: 通知APIの起動
 * @param body : string
 *
 * @return
 */  
const sendNotify = async function (name: string, body: string) {
    try{
        LibNotify.displayNotification(name, body);
    } catch (e) {
        console.error(e);
        throw new Error('Error , sendNotify');
    }    
}
//
const beepStart = function () {
    LibNotify.beep({ time: .3 });
}
</script>

<!-- CSS -->
<style>
.chat_show_modal_wrap #open_post_show { display: none ;}
</style>

<!-- MarkUp -->
<div class="container my-2">
    <h1>{data.id}</h1>
    ID: {data.id}
    <hr class="my-1" />
    <div class="row">
        <div class="col-sm-9">
        <textarea class="form-control" name="body" id="body" rows="3" />
        </div>
        <div class="col-sm-3">
            <button class="mt-2 btn btn-outline-primary" on:click={addItem} >
            Post</button>
        </div>
    </div>
    <hr class="my-1" />
    {#each chat_posts as item}
    <div>
        <h5>{item.UserName}</h5>
        <hr class="my-1" />
        <p>{@html LibCommon.replaceBrString(item.body)}</p>
        <p>{LibCommon.converDateString(item.createdAt)}, ID: {item.id}
        </p>
        <button on:click={parentShow(item.id)}
        class="btn btn-sm btn-outline-primary">Show</button>
        <hr />
    </div>
    {/each}  
    <!-- Modal -->
    <div class="chat_show_modal_wrap">
        <button type="button" class="btn btn-primary" id="open_post_show"
        data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal
       </button>
        <div class="modal fade" id="exampleModal" tabindex="-1"
          aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    {#if modal_display}
                    <ModalPost post_id={post_id} parentGetList={parentGetList} />
                    {/if}
                </div>
            </div>
        </div>    
    </div>
</div>

<!--
<a href={`/chats`} class="btn">[ Back ]
</a>		
<p>{convertBodyText(item.body)}
<p>{item.createdAt}, ID: {item.id}</p>
</p>
--->
