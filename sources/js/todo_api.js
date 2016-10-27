var REST_API = "http://localhost:8000/api/todo/";

function getItems() {
    xhrGet(REST_API, function (responseText) {
    	try {
    		console.log(responseText);
	        var data = JSON.parse(responseText);
    		console.log(data);
	        loadTable(data);
        }
		catch(e) {
			console.log("no items");
		}
    }, function(err){
    	console.error(err);
    });
}

function loadTable(rows) {
    var tableBody = document.getElementById('tblTodo').getElementsByTagName('tbody')[0];
    var newTableBody = document.createElement('tbody');
    //var rows = data.results;

    for (i = 0; i < rows.length; ++i) {
        var row = rows[i];
        console.log(JSON.stringify(row));

        var tr = document.createElement('TR');

        var td = document.createElement('TD');
        td.innerHTML = row.name;
        tr.appendChild(td);

        var td = document.createElement('TD');
        td.innerHTML = row.date;
        tr.appendChild(td);

        var td = document.createElement('TD');
        td.innerHTML = row.isComplete;
        tr.appendChild(td);

        var td = document.createElement('TD');

        var btnEdit = document.createElement('input');
        btnEdit.id = "btnEdit";
        btnEdit.value = "Edit";
        btnEdit.type = "button";
        btnEdit.setAttribute("onclick", "getItem('" + row.id + "')");
        btnEdit.setAttribute("class", "btn-default");
        td.appendChild(btnEdit);

        var btnRemove = document.createElement('input');
        btnRemove.id = "btnRemove";
        btnRemove.value = "Remove";
        btnRemove.type = "button";
        btnRemove.setAttribute("onclick", "deleteItem(this.parentNode, '" + row.id + "')");
        btnRemove.setAttribute("class", "btn-default");
        td.appendChild(btnRemove);

        tr.appendChild(td);

        newTableBody.appendChild(tr);
    }
    tableBody.parentNode.replaceChild(newTableBody, tableBody);
}

function saveItem () {
    var id = document.getElementById('hdnId').value;
    var name = document.getElementById('txtName').value;
    var date = document.getElementById('txtDate').value;
    var isComplete = document.getElementById('txtIsComplete').value;

    var data = {
    	id: id,
        name: name,
        date: date,
        isComplete: isComplete
    };

    console.log(data);

    if(id == 0){
		xhrPost(REST_API, data, function (responseText) {
			console.log("inserted");
			getItems();
            clearForm();
		}, function (err) {
		    console.error(err);
		});
	}
	else{
		xhrPut(REST_API + id, data, function (responseText) {
			console.log("updated");
            getItems();
            clearForm();
        }, function (err) {
            console.error(err);
        });
	}
}

function getItem(id)
{
    xhrGet(REST_API + id, function (responseText) {
        var data = JSON.parse(responseText);
        viewItem(data);
    }, function (err) {
        console.error(err);
    });
}

function deleteItem(deleteBtnNode, id) {
    var row = deleteBtnNode.parentNode;
    xhrDelete(REST_API + id, function () {
        row.parentNode.removeChild(row);
    }, function (err) {
        console.error(err);
    });
}

function clearForm() {
    document.getElementById('hdnId').value =
    document.getElementById('txtName').value = 
    document.getElementById('txtDate').value = 
    document.getElementById('txtIsComplete').value = "";
}

function viewItem(data)
{
    document.getElementById('hdnId').value = data.id;
    document.getElementById('txtName').value = data.name;
    document.getElementById('txtDate').value = data.date;
    document.getElementById('txtIsComplete').value = data.isComplete;
}