'use strict';

angular.module('campaignApp')
  .factory('User', function () {

    var usersRef = new Firebase('https://campaign.firebaseio.com/users');
    
    var User = function() {
      this.sales = new Array();
    }

    User.prototype.setName = function(name) {
      this.name = name;
    }

    User.prototype.setEmail = function(email) {
      this.email = email;
    }

    User.prototype.addSale = function(sum, campaign) {

        var sale;

        if (sum && sum > 0 && campaign) {   
          sale.sum = sum;
          sale.campaign = campaign;

          this.sales.push(sale);
          return true;
        }
        else {
          return false;
        }
    }

    User.prototype.getName = function() {
        return this.name;
    }

    User.prototype.getEmail = function() {
        return this.email;
    }

    User.prototype.getSales = function() {
        return this.sales;
    }

    User.prototype.save = function(userId) {
      var user = usersRef.child("user_"+userId).set(this);
    }

    User.prototype.update = function() {
      usersRef.child(this.id).update(this);
    }

    // Public API here
    return {
      createNewUser: function (name, email) {
        var user = new User();

        user.setName(name);
        user.setEmail(email);

        return user;
      },
      getUserObj: function(obj) {
        var user = new BingoGame();

        user.name = obj.name;
        user.email = obj.email;
        user.sales = obj.sales;

      }
    };
  });
