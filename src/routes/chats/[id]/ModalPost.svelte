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
.chat_show_modal_wrap #open_post_show { display: none ;}
</style>

<!-- MarkUp -->
<div class="chat_show_modal_wrap">
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" id="open_post_show"
     data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
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
        </div>
      </div>
    </div>
    <!-- Modal_end -->
</div>
