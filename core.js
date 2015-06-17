$(document).ready(function(){
	ymaps.ready(init); //вызывает ymaps как только страница будет готова
	var myMap;

	function init() { //функция работы с картой после загрузки страницы
		myMap = new ymaps.Map("map", { //создаём новую карту с заданным центром
		center: [56.010036, 92.849126],
		zoom: 12
		});

		var multiRoute_model = new ymaps.multiRouter.MultiRouteModel([[56.012451,92.805707],[56.028068,92.888388]] //создаём модель мультимаршрута
		,{
			avoidTrafficJams: false,
		});

		var multiRoute = new ymaps.multiRouter.MultiRoute(multiRoute_model, { //создаём сам маршрут на основе модели
			wayPointDraggable: true,
			boundsAutoApply: true
		});

		multiRoute.editor.start(); //запускаем редактор маршрута

		myMap.geoObjects.add(cur_route = multiRoute); //добавляем маршрут на карту
		multiRoute.model.events.add("requestchange", function(event) { //при изменении маршрута, добавляем координаты в поля
			var arr = multiRoute_model.getReferencePoints(); //получаем координаты опорных точек и заносим в массив
			getAdress(arr[0],arr[1]); //вызываем функцию получения адреса
			var dist = multiRoute.getRoutes().get(0).properties.get('distance').text; //длина в км
			var dist_metr = multiRoute.getRoutes().get(0).properties.get('distance').value; //длина в метр.
			$(".length").html(dist);
			$(".length_metr").html('('+dist_metr + ' метров)');
		})

		function getAdress(point_a,point_b) { //получаем адрес по координатам
			$("input[name='point_a']").val('Идёт поиск...');
			$("input[name='point_b']").val('Идёт поиск...');
			ymaps.geocode(point_a).then(function(res) {
				$("input[name='point_a']").val(res.geoObjects.get(0).properties.get('name'));
			})
			ymaps.geocode(point_b).then(function(res) {
				$("input[name='point_b']").val(res.geoObjects.get(0).properties.get('name'));
			})
		}

		function update_route(point_a, point_b) { //функция обновления маршрута по введённым полям
			cur_route.editor.stop();
			cur_route.model.destroy();
			myMap.geoObjects.remove(cur_route); //удаляем текущую модель и текущий маршрут
			if ($.isNumeric(point_a)) { //если введена координата, то заносим её в массив
				point_a = point_a.split(',');
			};
			if ($.isNumeric(point_b)) {
				point_b = point_b.split(',');
			}
			var multiRoute_model = new ymaps.multiRouter.MultiRouteModel([point_a,point_b] //делаем модель по введённым точкам
			, {
				avoidTrafficJams: false,
			});

			var multiRoute = new ymaps.multiRouter.MultiRoute(multiRoute_model, { //делаем отображение модели
				wayPointDraggable: true,
				boundsAutoApply: true
			});


			multiRoute.editor.start(); //запускаем редактор

			multiRoute.model.events.add("requestchange", function(event) { //обрабатываем изменение маршрута
				var arr = multiRoute_model.getReferencePoints();
				getAdress(arr[0],arr[1]);
				var dist = multiRoute.getRoutes().get(0).properties.get('distance').text; //длина в км
				var dist_metr = multiRoute.getRoutes().get(0).properties.get('distance').value; //длина в метр.
				$(".length").html(dist);
				$(".length_metr").html('('+dist_metr + ' метров)');
			})
			multiRoute.model.events.add("requestsuccess", function(event) { //после добавления маршрута
				var dist = multiRoute.getRoutes().get(0).properties.get('distance').text; //длина в км
				var dist_metr = multiRoute.getRoutes().get(0).properties.get('distance').value; //длина в метр.
				$(".length").html(dist);
				$(".length_metr").html('('+dist_metr + ' метров)');
			})
			myMap.geoObjects.add(cur_route = multiRoute); //добавляем маршрут на карту
		}

		$("input[name='reroute']").click(function() { //ждём клик на кнопку
			point_a = $("input[name='point_a']").val();
			point_b = $("input[name='point_b']").val();
			update_route(point_a,point_b); //вызываем функцию обновления маршрута
		})
	}
})