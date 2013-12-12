'use strict';

angular.module('campaignApp')
		.service('Campaign', function() {

			var firebaseURL = "https://campaign-dev.firebaseio.com";

			var Campaign,
				campaignRef = new Firebase(firebaseURL+'/campaigns');

			Campaign = function (name, goal, validFrom, validTo) {
				this.name = name;
				this.goal = goal;
				this.validFrom = validFrom;
				this.validTo = validTo;
			};

			Campaign.prototype.save = function () {
				var campaign = campaignRef.push(this);
				campaignRef.child(campaign.name()).update({id: campaign.name()});
				console.log('saved ' + campaign);
			};

			return {
				createNewCampaign: function (name, goal, validFrom, validTo) {
					return new Campaign(name, goal, validFrom, validTo);
				}
			};
		});