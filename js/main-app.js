var AppName = 'ToDo-Firebase_SearchJs',
		Tasks = 'tasks';

var searchConfig = {
	searchin: [ 'desc' ]
};

var 
	fbRef = firebase.database().ref().child(AppName),
	TaskList = [],
	addNewTask = function(taskObj, callMeAfterthat){
		var dt = new Date();
		taskObj.on = dt.toString();
		taskObj.sortData = dt.getTime(); 
		fbRef.child(Tasks).push(taskObj, function(error) {
		  if(typeof callMeAfterthat == 'function'){
				callMeAfterthat(error);
			}
		});
	},
	SearchData = function(datatoFilter){
		var searchinput = $('.SearchInput').val();
		searchinput = searchinput.toUpperCase();
		var filteredRes = [];
		for(var d in datatoFilter){
			var indata = datatoFilter[d];
			for(var id in indata){
				if($.inArray(id, searchConfig.searchin) > -1){
					var chData = indata[id].toUpperCase();
					if(chData.indexOf(searchinput) > -1){
						var tempD = datatoFilter[d];
						tempD.fb_Pushid = d;
						filteredRes.push(tempD);
					}
				}
			}
		}
		return filteredRes;
	},
	ReanderView = function(list){
		var rendHtm = '';
		$('.taskCount').html(list.length);
		if(list.length > 0){
			for(var l in list){
				var li = list[l];
				rendHtm = `
					<li>
						<span class="uk-text-meta uk-margin-remove uk-align-right"><small>`+li.on+`</small></span>
						<div>`+li.desc+`</div>
					</li>
				` + rendHtm;
			}
		}else{
			rendHtm += `<li>No Result found </li>`;
		}
		$('.TaskList').html(rendHtm);
	},
	renderTasks = function(){
		var searchFilter = SearchData(TaskList);
		ReanderView(searchFilter);
	};

fbRef.child(Tasks).orderByChild('sortData').on('value', snap => {
	TaskList = snap.val();
	renderTasks();
})


$(document).ready(function(){
	$(".SearchInput").keyup(function(event) {
    renderTasks();
    if (event.keyCode === 13) {
      // renderTasks();
    }
	});
	$('.ModalTriggerButton').click(function(){
		$('.TaskDesc').val('');
		$('.AddTaskLoad').hide();
	});
	$('.AddNewtask').click(function(){
		$('.AddTaskLoad').show();
		var descrp = $('.TaskDesc').val();
		if(descrp.trim() == ''){
			UIkit.modal.alert('Task Description Not Found :(')
			return false;
		}
		var taskObj = {
			desc : descrp
		};
		addNewTask(taskObj, function(e){
			$('.AddTaskLoad').hide();
			UIkit.modal('#TodoModal').hide();
		})
	})
});