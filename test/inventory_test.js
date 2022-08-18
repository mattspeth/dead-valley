describe("inventory", function() {

  require(['inventory/Smeat',
           'inventory/Medkit',
           'inventory/Shotgun'], function () {});

  // because we fake double clicks
  function doubleClickThen(node, callback) {
    node.click();
    node.click();

    waits(300);

    runs(callback);
  }

  beforeEach(function () {
    $('.back').click();
    $('#resume').click();

    clearSprites();

    $dudeInventory = $('#dude-inventory');
    $dudeInventory.css('visibility', 'visible');

    Game.dude.inventory.clear();
    Game.dude.hands.clear();
  });

  it("opens and closes when i is pressed", function () {
    $dudeInventory.css('visibility', 'hidden');
    pressKey('i');

    waits(100);
    runs(function () {
      expect($dudeInventory.css('visibility')).toEqual('visible');

      pressKey('i');

      waits(100);
      runs(function () {
        expect($dudeInventory.css('visibility')).toEqual('hidden');
      });
    });
  });

  it("moves an item to an open hand when double-clicked", function () {
    Cheat.give('Smeat');
    var smeatz = $('.inventory-item:first');
    expect(smeatz.parents('table.inventory')).not.toHaveId('dude-hands');

    doubleClickThen(smeatz, function () {
      expect(smeatz).toBeVisible();
      expect(smeatz.parents('table.inventory')).toHaveId('dude-hands');
    });
  });

  it("moves an item back to the inventory when double clicks in the hands", function () {
    var canOSmeat = createItem('Smeat');
    Game.dude.hands.stuffItemIn(canOSmeat);

    var smeatz = $('.inventory-item:first');

    expect(smeatz.parents('table.inventory')).toHaveId('dude-hands');

    doubleClickThen(smeatz, function () {
      expect(smeatz).toBeVisible();
      expect(smeatz.parents('table.inventory')).not.toHaveId('dude-hands');
    });
  });

  it("doesn't move an item on double click if it can't fit in the hands", function () {
    var medkit = createItem('Medkit');
    Game.dude.hands.stuffItemIn(medkit);

    Cheat.give('Smeat');
    var smeatz = $('.inventory-item:first');
    expect(smeatz.parents('table.inventory')).not.toHaveId('dude-hands');

    doubleClickThen(smeatz, function () {
      expect(smeatz).toBeVisible();
      expect(smeatz.parents('table.inventory')).not.toHaveId('dude-hands');
    });
  });

  it("doesn't move an item back from the hands on double click if the inventory has no room", function () {
    // fill that inventory
    var i;
    for (i = 0; i < 3; i++) {
      Cheat.give('Shotgun');
    }

    var medkit = createItem('Medkit');
    Game.dude.hands.stuffItemIn(medkit);

    var medkitNode = $('#dude-hands .inventory-item:first');

    doubleClickThen(medkitNode, function () {
      expect(medkitNode).toBeVisible();
      expect(medkitNode.parents('table.inventory')).toHaveId('dude-hands');
    });
  });

  it("removes the item from the inventory when it is clicked on", function () {
    Cheat.give('Smeat');

    var smeatz = $('.inventory-item:first');

    waitsFor(function () {
      return smeatz.is(":visible");
    }, 100);

    runs(function () {
      var offset = smeatz.offset();

      simulateClick(offset.left + 20, offset.top + 20);

      waits(300);

      runs(function () {
        var Smeat = require('inventory/Smeat');
        expect(Game.dude.inventory.findItem(Smeat)).toBeUndefined();
        expect($("img.click-dragging[src*='smeat']")).toExist();
      });
    });
  });

  it("is hidden when a new game is created", function () {
    $dudeInventory.css('visibility', 'hidden');
    pressKey('i');

    waits(100);
    runs(function () {
      expect($dudeInventory.css('visibility')).toEqual('visible');

      startNewGame();

      waits(300);

      runs(function () {
        $('#intro-screen').click();
        expect($dudeInventory.css('visibility')).toEqual('hidden');
      });
    });
  });

});
