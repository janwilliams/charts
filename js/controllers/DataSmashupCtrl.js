angular.module('DataSmashupCtrl', ['ui.bootstrap']).controller('DataSmashupController', function($scope, $modal, $http, Services,InitialSiteService) {
   
	InitialSiteService.hideInitialLoader();
	
	$scope.filtered = undefined;
    //SERVER DATA TABLE
    Services.getServerData().then(function (data) {
        $scope.serverRowCollection = $scope.originalServerRowCollection = data;
        $scope.totalRows = data.length;
        var headers = data[0];
        var columnCollection = [];
        for(key in headers) {
            columnCollection.push({
                label: key,
                map: key
            });
        }
        $scope.serverColumnCollection = columnCollection;
        $scope.serverConfig = {
            isGlobalSearchActivated: true,
            syncColumns: false,
            isPaginationEnabled: true,
            itemsByPage: 10,
            maxSize: 8
        };
        $scope.serverData = data;
    });

    $scope.pageLangs = languageData.pages.mashUp;
    $scope.nav = languageData.nav;
    $scope.header = languageData.header;
    $scope.footer = languageData.footer;
    $scope.dictionary = languageData.dictionary;
    //SERVER DATA TABLE
    var fileServerEl = document.getElementById('serverFile');
    fileServerEl.addEventListener('change', handleFileServerSelect, false);
    var serverDropZone = document.getElementById('serverTableContainer');
    serverDropZone.addEventListener('dragover', Services.handleDragOver, false);
    serverDropZone.addEventListener('drop', handleFileServerSelect, false);
    serverDropZone.addEventListener('click', function () {
        fileServerEl.value = '';
        fileServerEl.click();
    }, false);

    function handleFileServerSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var file, fd;
        if(evt.target.tagName === 'INPUT') {
            file = evt.target.files[0];
        } else {
            file = evt.dataTransfer.files[0];
        }
        var t = file.name;
        $scope.filename = t.substr(0, t.indexOf('.csv'));
        fd = new FormData();
        fd.append('csv', file);
        Services.csvProcess(fd).then(function (data) {
            $scope.serverRowCollection = $scope.originalServerRowCollection = data;
            $scope.totalRows = data.length;
            var headers = data[0];
            var columnCollection = [];
            for(key in headers) {
                columnCollection.push({
                    label: key,
                    map: key
                });
            }
            $scope.serverColumnCollection = columnCollection;
            $scope.serverConfig = {
                isGlobalSearchActivated: true,
                syncColumns: false,
                isPaginationEnabled: true,
                itemsByPage: 10,
                maxSize: 8
            };
            $scope.serverData = data;
            serverDropZone.style.display = 'none';
            serverDropZone.nextElementSibling.style.display = '';
        });

    }
    //CLIENT DATA TABLE
    var fileEl = document.getElementById('file');
    fileEl.addEventListener('change', handleFileSelect, false);
    var dropZone = document.getElementById('clientTableContainer');
    dropZone.addEventListener('dragover', Services.handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    dropZone.addEventListener('click', function () {
        fileEl.value = '';
        fileEl.click();
    }, false);

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var file, fd;
        if(evt.target.tagName === 'INPUT') {
            file = evt.target.files[0];
        } else {
            file = evt.dataTransfer.files[0];
        }
        var t = file.name;
        $scope.filename = t.substr(0, t.indexOf('.csv'));
        fd = new FormData();
        fd.append('csv', file);
        Services.csvProcess(fd).then(function (data) {
            var arr = data.sort(Services.dynamicSort('Key'));
            $scope.userRowsCount = arr.length;
            var headers = arr[0];
            $scope.clientRowCollection = arr;
            var columnCollection = [];
            for(key in headers) {
                columnCollection.push({
                    label: key,
                    map: key
                });
            }
            $scope.clientColumnCollection = columnCollection;
            $scope.clientConfig = {
                isPaginationEnabled: true,
                isGlobalSearchActivated: true,
                itemsByPage: 10,
                syncColumns: false
            };
            dropZone.style.display = 'none';
            dropZone.nextElementSibling.style.display = '';
            //$scope.$apply();
            $scope.filtered = Services.filterServerArray($scope.serverRowCollection, $scope.clientRowCollection, columnCollection[1].map, columnCollection[0].map);

            $scope.keyColumn = columnCollection[0].map;
            //Counting orphan keys
            $scope.orphanKeys = 0;
            $.each(arr, function(i, obj){
                key = obj.Key !== undefined ? obj.Key : obj[$scope.keyColumn];
                var matches = jQuery.grep($scope.serverData, function(obj, i) {
                    return obj.Key === key;
                });
                if (0 === matches.length) {$scope.orphanKeys++;}
            });
        });
        //show table pagination
        $('#client-table-container tfoot').removeClass('ng-hide').show();
        //set client table min height
        $('#client-table-container table').css('min-height', '611px');
        //show scrollbar (Chrome issue)
        $('#client-table-container').css('overflow', 'auto');
        $('#client-table-container').css('overflow-y', 'hidden');

        //Highlighting
            setTimeout(function() {
                $('#client-table-container table tr:not(:first) td:first-child').each(function(){
                    ctn = $(this).text();
                    var matches = jQuery.grep($scope.serverData, function(obj, i) {
                        return obj.Key === ctn;
                    });
                    if (0 === matches.length) {$(this).parent().css('color', 'red')}
                })
            }, 100);

    }
    //EVENTS
    var Mashup = document.getElementById('Mashup');
    Mashup.addEventListener('click', function () {
        $scope.$apply(function () {
            $scope.clearRightTable();
            $scope.userRowsCount = null;
        });
    }, false);
    var Clear = document.getElementById('Clear');
    Clear.addEventListener('click', function () {
        $('.table-top-numbers').addClass('animate-enter');
        $scope.$apply(function () {
            $scope.clearRightTable();
            $scope.resetLeftTable();
            $scope.rowsRemoved = null;
            $scope.rowsLeft = null;
            $scope.userRowsCount = null;
        });
        setTimeout(function() {
            $('.table-top-numbers').removeClass('animate-enter');
        }, 500);
    }, false);
    var Save = document.getElementById('Save');
    Save.addEventListener('click', function () {
        var data = angular.toJson($scope.clientRowCollection);
        var filename = prompt("Please enter file name", "");
        var fn = filename || $scope.filename;
        Services.uploadFilteredViewJson(fn, data).then(function (res) {
            alert('File Saved on Server');
        });
    }, false);
    //Clear server data table
    var ClearServer = document.getElementById('clear-server-data');
    ClearServer.addEventListener('click', function () {
        $('.table-top-numbers').addClass('animate-enter');
        $scope.$apply(function () {
            $scope.clearLeftTable();
            $scope.resetLeftTable();
            $scope.totalRows = null;
        });
        setTimeout(function() {
            $('.table-top-numbers').removeClass('animate-enter');
        }, 500);
    }, false);
    var Library = document.getElementById('Library');
    Library.addEventListener('click', function () {
        Services.getLibraryData().then(function (data) {
            $scope.libraryRowCollection = data;
            var headers = data[0];
            $scope.libraryColumnCollection = data;
            var columnCollection = [];
            for(key in headers) {
                columnCollection.push({
                    label: key,
                    map: key
                });
            }
            $scope.libraryColumnCollection = columnCollection;
            $scope.libraryConfig = {
                isPaginationEnabled: false,
                isGlobalSearchActivated: false,
                itemsByPage: 20,
                syncColumns: false
            };
            var LibraryModalInstanceCtrl = function ($scope, $modalInstance, items) {
                //console.log(items);
                $scope.libraryRowCollection = items;
                $scope.ok = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
            var modalInstance = $modal.open({
                templateUrl: 'libraryModal',
                controller: LibraryModalInstanceCtrl,
                size: 'lg',
                resolve: {
                    items: function () {                         
                        return data;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                $scope.libraryRowCollection = data;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        });
    }, false);
    $scope.clearRightTable = function () {
        $scope.clientColumnCollection = null;
        $scope.clientRowCollection = null;
        dropZone.style.display = '';
        dropZone.nextElementSibling.style.display = 'none';
    }
    $scope.clearLeftTable = function () {
        $scope.serverColumnCollection = null;
        $scope.serverRowCollection = null;
        serverDropZone.style.display = 'block';
        serverDropZone.nextElementSibling.style.display = 'none';
    }
    $scope.resetLeftTable = function () {
        $scope.serverRowCollection = $scope.originalServerRowCollection;
    }
    $scope.$watch('filtered', function (newValue, oldValue) {
        if(newValue === undefined) return;
        $('.table-top-numbers').addClass('animate-enter');
        $scope.serverRowCollection = newValue;
        $scope.rowsRemoved = $scope.totalRows - newValue.length;
        $scope.rowsLeft = newValue.length;
        setTimeout(function() {
            $('.table-top-numbers').removeClass('animate-enter');
        }, 500);
    });
});

