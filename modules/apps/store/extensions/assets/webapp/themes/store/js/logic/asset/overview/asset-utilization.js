$(function(){

    console.info('The subscription widget has been loaded');
    var APP_NAME_FIELD='#subsAppName';
    var TIER_FIELD='#subsAppTier';
    var API_URL='/store/resources/webapp/v1/subscription/app';
    var API_UNSUBSCRIPTION_URL='/store/resources/webapp/v1/unsubscription/app';

    $('#btnSubscribe').on('click',function(){
			getAppDetails();
    });
    
    
    $('#btnUnsubscribe').on('click',function(){
    	 removeAppDetails();
   });

    $('#btnEnterpriseSubscriptions').on('click',function(){
       getEnterpriseSubscriptionDetails();
   });

   var getAppDetails=function(){

         if(metadata){
             console.log('Found metadata');
             var appName=getAppName();
             var tier=getTier();

             //Obtain the required information
             var subscription={};
             var apiDetails=metadata.apiAssetData.attributes;
             subscription['apiName']=apiDetails.overview_name;
             subscription['apiVersion']=apiDetails.overview_version;
             subscription['apiTier']=tier;
             subscription['apiProvider']=apiDetails.overview_provider;
             subscription['appName']="DefaultApplication";

             subscribeToApi(subscription);
         }
    };
    
    var getEnterpriseSubscriptionDetails = function(){

      if(metadata){
             
             //Obtain the required information
             var subscription={};
             var apiDetails=metadata.apiAssetData.attributes;

             var ssoProviderInfo = apiDetails.sso_ssoProvider.split("-");

             subscription['appName']=apiDetails.overview_name;
             subscription['meta'] = {};
             subscription['meta']['ssoProviderName'] = ssoProviderInfo[0];
             subscription['meta']['ssoProviderVersion'] = ssoProviderInfo[1];

             $.ajax({
              url:'/store/resources/webapp/v1/enterprise-subscription/app',
              type:'GET',
              data:subscription,
              success:function(response){
              
              },
              error : function(response) {
                alert('Error occured in subscribe');
              }
            });
      }

    };

    var removeAppDetails=function(){

        if(metadata){
            console.log('Found metadata');
            var appName=getAppName();
            var tier=getTier();

            //Obtain the required information
            var subscription={};
            var apiDetails=metadata.apiAssetData.attributes;
            subscription['apiName']=apiDetails.overview_name;
            subscription['apiVersion']=apiDetails.overview_version;
            subscription['apiTier']=tier;
            subscription['apiProvider']=apiDetails.overview_provider;
            subscription['appName']="DefaultApplication";


            unsubscribeToApi(subscription);
        }
   };
    

    var getAppName=function(){
       return $(APP_NAME_FIELD)?$(APP_NAME_FIELD).val():'';
    };

    var getTier=function(){
       return $(TIER_FIELD)?$(TIER_FIELD).val():'';
    };

    /*
    The method invokes the API call which will subscribe the provided application to the given api
     */
    var subscribeToApi=function(subscription){
        $.ajax({
           url:API_URL,
           type:'POST',
           data:subscription,
           success:function(response){
        	   if(JSON.parse(response).error == false){
        		   console.info('Successfully subscribed to Web app: '+subscription.apiName);
        		   //alert('Succsessfully subscribed to the '+subscription.apiName+' Web App.');
        		   
        		    $('#messageModal1').html($('#confirmation-data1').html());
        		    $('#messageModal1 h3.modal-title').html(('Subscription Successful'));
        		    $('#messageModal1 div.modal-body').html('\n\n'+ ('Congratulations! You have successfully subscribed to the ')+'<b>"' + subscription.apiName + '</b>"');
        		    $('#messageModal1 a.btn-other').html('OK');
        		    
        		   
        		    $('#messageModal1').modal();
        		    $('#btnUnsubscribe').show();
 	               	    $('#btnSubscribe').hide();
 	                    $('#subscribed').val(true);
        	   }else{
              		    console.info('Error occured in subscribe to web app: '+subscription.apiName);
               }
           },
           error : function(response) {
      			alert('Error occured in subscribe');
      	   }
        });
    };
    
    
    var unsubscribeToApi=function(subscription){

        $.ajax({
           url:API_UNSUBSCRIPTION_URL,
           type:'POST',
           data:subscription,
           success:function(response){
        	   if(JSON.parse(response).error == false){
               	  	console.info('Successfully unsubscribed to web app: '+subscription.apiName);
                	//alert('Succsessfully unsubscribed to the '+subscription.apiName+' Web App.');
               	
                    	$('#messageModal1').html($('#confirmation-data1').html());
    		    	$('#messageModal1 h3.modal-title').html(('Unsubscription Successful'));
    		    	$('#messageModal1 div.modal-body').html('\n\n'+ ('You have successfully unsubscribed to the ')+'<b>"' + subscription.apiName + '</b>"');
    		    	$('#messageModal1 a.btn-other').html('OK');

    		    	$('#messageModal1').modal();
                    	$('#btnUnsubscribe').hide();
                    	$('#btnSubscribe').show();
	            	$('#subscribed').val(false);
		   }else{
           		console.info('Error occured in unsubscribe to web app: '+subscription.apiName);
           	   }
        	   
           },
           error : function(response) {
   			alert('Error occured in unsubscribe');
   		  }
        });
    };
    
    
  
});
