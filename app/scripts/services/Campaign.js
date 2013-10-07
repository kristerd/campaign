'use strict';

angular.module('campaignApp')
		.service('Campaign', function() {
			var Campaign,
				campaignRef = new Firebase('https://campaign.firebaseio.com/campaigns');

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