var app = angular.module("TodoApp", []);

app.controller("MainController", function($scope, $http) {
    $scope.formData = {};
    
    $http.get("/api/todos")
    .success(function(res) {
        $scope.todos = res;
        console.log("Successfully retrieved todos", res);
    })
    .error(function(res) {
        console.log("Error: "+res);
        $scope.todos = [];
    });

    $scope.createTodo = function() {
        $http.post("/api/todos", $scope.formData)
        .success(function(res) {
            $scope.formData = {};
            $scope.todos = res;
            console.log(res);
        })
        .error(function(res) {
            console.log("Error: "+res);
        });
    };
    
    $scope.deleteTodo = function(id) {
        $http.delete("/api/todos/"+id)
        .success(function(res) {
            $scope.todos = res;
            console.log(res);
        })
        .error(function(res) {
            console.log("Error: "+res);
        });
    };
    
    $scope.updateTodo = function(id, completed) {
        $http.put("/api/todos/"+id+"/"+completed)
        .success(function(res) {
            $scope.todos = res;
            console.log(res);
        })
        .error(function(res) {
            console.log("Error: "+res);
        });
    };
});