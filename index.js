var app = (function() {
  var $empty;
  var $items;
  var $total;
  var $totalcost;
  var $selectedCountry;
  var $countriesPopup;

  var data = {
    stato: '',
    jaroj: 0,
    dormi: false,
    noktoj: 7,
    unulito: false,
    tejo: false,
    prelegi: false,
    nova: false
  };

  var programkotizo = {
    'A': { now: [32, 64, 96], july: [40, 80, 120] },
    'B': { now: [19.2, 38.4, 57.6], july: [24, 48, 72] },
    'C': { now: [6.4, 12.8, 19.2], july: [8, 16, 24] }
  }

  var generateBillItems = function() {
    var items = [];

    if (data.stato === '' || data.jaroj === 0 || isNaN(data.jaroj)) {
      return;
    }

    var monthKey = new Date >= new Date('2018-06-30') ? 'july' : 'now';
    var costIndex = data.jaroj >= 30 ? 2 : data.jaroj >= 18 ? 1 : 0;

    items.push({
      description: 'Programkotizo (' + data.stato + '-ŝtato)',
      cost: programkotizo[data.stato][monthKey][costIndex]
    });

    if (data.dormi) {
      for (var i = 0; i < data.noktoj; i++) {
        items.push({
          description: 'Loĝado kaj manĝado, tago ' + (i + 1),
          cost: data.unulito ? 32 : 25
        });
      }
    }

    if (!data.tejo) {
      items.push({
        description: 'Nemembro de TEJO',
        cost: 21
      });
    }

    if (data.prelegi) {
      items.push({
        description: 'Mi prelegos aŭ preparos aktivaĵojn',
        cost: -5
      });
    }

    if (data.nova) {
      items.push({
        description: 'Mi estas nova lernanto (mia instruisto kontaktos TEJO)',
        discount: 25
      });
    }

    return items;
  };

  var createItem = function(description, cost) {
    var $item = $('<li>');

    var $desc = $('<div>', { 'class': 'item' });
    $desc.text(description);
    $item.append($desc);

    var $arrow = $('<div>', { 'class': 'arrow' });
    $arrow.text('→');
    $desc.append($arrow);

    var $cost = $('<div>', { 'class': 'cost' });
    $cost.text(formatCost(cost));

    var $costContainer = $('<div>', { 'class': 'cost-container' });
    $costContainer.append($cost);
    $item.append($costContainer);

    return $item;
  };

  var renderCosts = function() {
    var items = generateBillItems();

    if (!items) {
      $empty.show();
      $items.hide();
      $total.hide();
      $noto.hide();
      return;
    }

    $empty.hide();
    $items.show();
    $items.empty();
    $total.show();
    $noto.show();

    var total = 0;

    for (var i = 0; i < items.length; i++) {
      if (items[i].cost) {
        total += items[i].cost;
        $items.append(createItem(items[i].description, items[i].cost));
      }

      if (items[i].discount) {
        var discount = items[0].cost * (items[i].discount / 100);
        total -= discount;
        $items.append(createItem(items[i].description, -discount));
      }
    }

    $totalcost.text(formatCost(total));
  };

  var formatCost = function(number) {
    var text = number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return /00$/.test(text) ? (text.slice(0, -3) + '€') : text + '€';
  };

  var displayCountriesPopup = function(show) {
    if (show) {
      $countriesPopup.css('display', 'block');
    } else {
      $countriesPopup.css('display', 'none');
    }
  };

  var init = function() {
    $empty = $('.result .empty');
    $items = $('.result ul');
    $total = $('.result .total');
    $noto = $('.result .antaŭpago');
    $totalcost = $('#totalcost');
    $selectedCountry = $('#selected-country');
    $countriesPopup = $('.countries-popup');

    $('#select-country').on('click', function() {
      displayCountriesPopup(true);
    });

    $('.country').on('click', function() {
      var name = $(this).text();
      var stato = $(this).data().stato;

      displayCountriesPopup(false);
      $selectedCountry.text(name);
      data.stato = stato;

      renderCosts();
    });

    $('#jaroj').on('input', function() {
      data.jaroj = parseInt($(this).val(), 10);
      renderCosts();
    });

    $('#dormi').on('change', function() {
      data.dormi = $(this).is(':checked');
      renderCosts();
    });

    $('#unulito').on('change', function() {
      data.unulito = $(this).is(':checked');
      renderCosts();
    });

    $('#noktoj').on('input', function() {
      data.noktoj = parseInt($(this).val(), 10);

      if (data.noktoj > 7) {
        data.noktoj = 7;
      }

      renderCosts();
    });

    $('#tejo').on('change', function() {
      data.tejo = $(this).is(':checked');
      renderCosts();
    });

    $('#prelegi').on('change', function() {
      data.prelegi = $(this).is(':checked');
      renderCosts();
    });

    $('#nova').on('change', function() {
      data.nova = $(this).is(':checked');
      renderCosts();
    });

    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        displayCountriesPopup(false);
      }
    });

    $countriesPopup.on('click', function(e) {
      if (e.target === this) {
        displayCountriesPopup(false);
      }
    });
  };

  return {
    init: init
  };
})();

