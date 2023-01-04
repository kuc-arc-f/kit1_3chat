<svelte:head>
	<title>Test</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
import LibDbSession from '$lib/LibDbSession';
import PostCommon from '../PostCommon';
import LibConfig from '$lib/LibConfig';
import LibCommon from '$lib/LibCommon';
//
export let post_id: number, post_body: string = "";
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
console.log(item);
      post_body = item.body;
    }
  } catch (e) {
    console.error(e);
  }  
}
loadProc();

</script>
<!-- CSS -->
<style>
</style>

<!-- ModalPost -->
<div class="chat_show_modal_body">
    <!-- Modal_body -->
    <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
        post_id={post_id}
        <p>{@html LibCommon.replaceBrString(post_body)}
        </p>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save</button>
    </div>
    <!-- Modal_body_end -->
</div>
