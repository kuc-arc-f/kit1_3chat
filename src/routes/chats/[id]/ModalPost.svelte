<svelte:head>
	<title>Test</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibDbSession from '$lib/LibDbSession';
import PostCommon from '../PostCommon';
import LibConfig from '$lib/LibConfig';
import LibCommon from '$lib/LibCommon';
import LibThread from '$lib/LibThread';
//
export let post_id: number, post_body: string = "",
postUserName: string = "", dateStr: string = "", postUserId: number,
chatId: number = 0, threadItems:any[] = [];
//, postItem: any
console.log("#ModalPost.post");
console.log("post_id=", post_id);
/**
* loadProc
* @param
*
* @return
*/   
const loadProc = async function () {
  try {
console.log("#loadProc.id=", post_id);
    const posts = await LibDbSession.get(LibConfig.SESSION_KEY_CHAT_POST);
    let result = posts.filter(post => post.id === post_id);
    if(result.length > 0) {
      const item = result[0];
//console.log(item);
      post_body = item.body;
      postUserName = item.UserName;
      postUserId = item.UserId;
      chatId = item.chatId;
      dateStr = LibCommon.converDatetimeString(item.createdAt);
      //Thread
      await getThread();
    }
  } catch (e) {
    console.error(e);
  }  
}
loadProc();
 /**
  * getThread :
  * @param
  *
  * @return Promise<void>
  */
const getThread = async function () : Promise<void>
{
  try {
    threadItems = await LibThread.getItems(post_id);
console.log(threadItems);    
  } catch (e) {
    console.error(e);
    alert("Error, getThread");
  }
}
/**
* createReply :
* @param
*
* @return Promise<void>
*/
const createReply = async function () : Promise<void>
{
  try {
    const body = document.querySelector<HTMLInputElement>('#modal_reply_body');
    const bodyString = body?.value; 
    await LibThread.create(post_id, bodyString, chatId, postUserId);
    await getThread();
//console.log(bodyString);
    //@ts-ignore
    body.value = "";
  } catch (e) {
    console.error(e);
    alert("Error, createReply");
  }
}
</script>
<!-- CSS -->
<style>
</style>

<!-- ModalPost -->
<div class="chat_show_modal_body">
    <!-- Modal_body -->
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{postUserName} </h5>
        <span class="text-secondary mx-2">{dateStr}</span>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        <p>{@html LibCommon.replaceBrString(post_body)}
        </p>
        <hr />
        ID: {post_id}
        <hr class="my-1" />
        <!-- replay_box -->
        <div class="row">
          <div class="col-sm-9"><textarea class="form-control" id="modal_reply_body" rows={3} />
          </div>
          <div class="col-sm-3">
            <button class="mt-2 btn btn-primary"on:click={() => createReply()} >
              Reply</button>
          </div>
        </div>  
        <!-- thread --> 
        {#each threadItems as item}
        <div>
          <div class="thread_user_name">
            <span class="fs-5">{item.UserName}: </span>{item.createdAt}
          </div>
          {item.body}
          <hr class="my-1" />
        </div>
        {/each}     
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        
    </div>
    <!-- Modal_body_end -->
</div>

<!-- 
<button type="button" class="btn btn-primary">Save</button>
-->