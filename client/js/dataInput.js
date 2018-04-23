$(document).ready(()=>{
  $('#alertBox').append(`
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <h4 class="alert-heading">Well done!</h4>
      <p>We've successfully verified your media and generated data for you.</p>
      <hr>
      <p class="mb-0">Give title to your media and whatever you find necessary to edit or add, Please go ahead.
      </p>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    `);

    $('[data-toggle="datepicker"]').datepicker({
        // autoShow:true,
    });
});
