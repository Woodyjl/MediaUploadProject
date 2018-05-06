$(document).ready(()=>{
  $('#submit').click(function(){
    $('#alertBox').append(`
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <h4 class="alert-heading">Upload Complete!</h4>
        <p>Your metadata has been recorded and is now pending verification. Upload more media <a href="index.html">here</a>.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `);

      $('[data-toggle="datepicker"]').datepicker({
          // autoShow:true,
    });
  });

});
