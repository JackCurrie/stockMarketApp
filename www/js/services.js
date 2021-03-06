

angular.module('myStockMarket.services', [] )

   .factory('encodeURIService', function() {
      return{
         encode : function(string) {
            console.log(string);
            return encodeURIComponent(string).replace(/\"/g, "%22" ).replace(/\ /g, "%20").replace(/[!'()]/g, escape);

         }
      };
   })

   .factory('dateService', function($filter){

      var currentDate = function(){
         var d = new Date();
         var date = $filter( 'date' )(d, 'yyyy-MM-dd');
         return date;

      };

      var oneYearAgoDate = function(){
         var d = new Date( new Date().setDate( new Date().getDate() - 365 ));
         var date = $filter( 'date' )(d, 'yyyy-MM-dd');
         return date;

      };

      return{
        currentDate : currentDate,
        oneYearAgoDate : oneYearAgoDate
      };

   })




   .factory('stockDataService', function( $q, $http, encodeURIService)  {

     var getDetailsData = function(ticker) {

        var deferred = $q.defer(),
        query = ' select * from yahoo.finance.quotes where symbol IN ("' + ticker + '")',
        url =  'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIService.encode(query)  + '&format=json&env=http://datatables.org/alltables.env';

        console.log(url);

        $http.get(url)
           .success(function(json) {
               var jsonData = json.query.results.quote;
               deferred.resolve(jsonData);
        })
           .error(function(error) {
              console.log(" Details Data Error " + error );
              deferred.reject();
        });

        return deferred.promise;

     };


     var getPriceData = function(ticker) {

        // Initialize the necessary Variables
        var deferred = $q.defer();
        var url =  "http://finance.yahoo.com/webservice/v1/symbols/" + ticker + "/quote?format=json&view=detail";

        // Retrive information from url
        //   If the information is retrieved, resolve the deffered object
        //   otherwise, log an error & reject deferred
        // At the end, return the deferred promise
        $http.get(url)
           .success(function(json) {
             var jsonData = json.list.resources[0].resource.fields;
             deferred.resolve(jsonData);
        })
           .error(function(error) {
              console.log(" Price Data Error " + error );
              deferred.reject();
        });
           return deferred.promise;
     };

      return {
         getPriceData : getPriceData,
         getDetailsData : getDetailsData
      };

})
;
















///
