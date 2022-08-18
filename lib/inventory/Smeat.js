// Smeat!

define(['Game', 'inventory/InventoryItem'],
       function (Game, InventoryItem) {

  var Smeat = function () {
    this.consumed = false;
  };

  Smeat.prototype = {
    use: function () {
      Game.dude.heal(1);
      this.consume();
    },
    viable: function () {
      return !this.consumed;
    }
  };

  InventoryItem(Smeat, {
    width:  1, 
    height: 1, 
    image:  'smeat',
    clazz:  'Smeat',
    name:   'Can of Smeat',
    description: 'Have you had your Smeat today?'
  });

  return Smeat;
});
