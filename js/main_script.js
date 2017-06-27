$(function()
  {
      //###########################################################################
      //CONSTANTS
      //###########################################################################

      var START_BUTTON = $("#start_btn");
      var STOP_BUTTON = $("#stop_btn");
      var FIRST_ALG_SELECT = $("#first_algorithm_select");
      var SECOND_ALG_SELECT = $("#second_algorithm_select");
      var ELEMENTS_COUNT_SELECT = $("#elements_count_select");
      var ARRAY_TYPE_SELECT = $("#array_type_select");
      var INTERVAL_SELECT = $("#interval_select");
      var ELEMENTS_CONTAINERS = $(".element_container");
      var INFO_CONTAINERS = $(".info_container");

      var PSEUDOCODES_CONTAINER = $("#pseudocodes_container");
      var BUBBLESORT_PSEUDOCODE_CONTAINER = $("#bubblesort_pseudocode_container");
      var SELECTIONSORT_PSEUDOCODE_CONTAINER = $("#selectionsort_pseudocode_container");
      var QUICKSORT_PSEUDOCODE_CONTAINER = $("#quicksort_pseudocode_container");
      var SHELLSORT_PSEUDOCODE_CONTAINER = $("#shellsort_pseudocode_container");
      var INSERTATIONSORT_PSEUDOCODE_CONTAINER = $("#insertationsort_pseudocode_container");
      var HEAPSORT_PSEUDOCODE_CONTAINER = $("#heapsort_pseudocode_container");

      var DESCRIPTIONS_CONTAINER = $("#descriptions_container");
      var BUBBLESORT_DESCRIPTIONS_CONTAINER = $("#bubblesort_descriptions_container");
      var SELECTIONSORT_DESCRIPTIONS_CONTAINER = $("#selectionsort_descriptions_container");
      var QUICKSORT_DESCRIPTIONS_CONTAINER = $("#quicksort_descriptions_container");
      var SHELLSORT_DESCRIPTION_CONTAINER = $("#shellsort_description_container");
      var INSERTATIONSORT_DESCRIPTION_CONTAINER = $("#insertationsort_description_container");
      var HEAPSORT_DESCRIPTION_CONTAINER = $("#heapsort_description_container");

      var PERFORMANCES_CONTAINER = $("#performances_container");
      var BUBBLESORT_PERFORFORMANCE_CONTAINER = $("#bubblesort_performance_container");
      var SELECTIONSORT_PERFORFORMANCE_CONTAINER = $("#selectionsort_performance_container");
      var QUICKSORT_PERFORFORMANCE_CONTAINER = $("#quicksort_performance_container");
      var SHELLSORT_PERFORMANCE_CONTAINER = $("#shellsort_performance_container");
      var INSERTATIONSORT_PERFORMANCE_CONTAINER = $("#insertationsort_performance_container");
      var HEAPSORT_PERFORMANCE_CONTAINER = $("#heapsort_performance_container");

      var DEFAULT_COLOR = "rgb(119, 119, 119)";
      var SELECTED_COLOR = "rgb(0, 0, 255)";
      var COMPARED_COLOR = "rgb(0, 153, 255)";
      var INSERT_INTO_ELEMENT_COLOR = "rgb(255, 0, 0)";
      var SWAP_COLOR = "rgb(34, 255, 0)";
      var VALUE_TO_TAKE_COLOR = "rgb(187, 187, 0)";
      var TEMP_VALUE_COLOR = "rgb(160, 0, 192)";
      var TEXT_DEFAULT_COLOR = "#C0C0C0";

      var BUBBLESORT_OBJECT = {
          func: bubblesort,
          description_container: BUBBLESORT_DESCRIPTIONS_CONTAINER,
          pseudocode_container: BUBBLESORT_PSEUDOCODE_CONTAINER,
          performance_container: BUBBLESORT_PERFORFORMANCE_CONTAINER
      };
      var SELECTIONSORT_OBJECT = {
          func: selectionsort,
          description_container: SELECTIONSORT_DESCRIPTIONS_CONTAINER,
          pseudocode_container: SELECTIONSORT_PSEUDOCODE_CONTAINER,
          performance_container: SELECTIONSORT_PERFORFORMANCE_CONTAINER
      };
      var QUICKSORT_OBJECT = {
          func: quicksort,
          description_container: QUICKSORT_DESCRIPTIONS_CONTAINER,
          pseudocode_container: QUICKSORT_PSEUDOCODE_CONTAINER,
          performance_container: QUICKSORT_PERFORFORMANCE_CONTAINER
      };
      var SHELLSORT_OBJECT = {
          func: shellsort,
          description_container: SHELLSORT_DESCRIPTION_CONTAINER,
          pseudocode_container: SHELLSORT_PSEUDOCODE_CONTAINER,
          performance_container: SHELLSORT_PERFORMANCE_CONTAINER
      };
      var INSERTATIONSORT_OBJECT = {
          func: insertionsort,
          description_container: INSERTATIONSORT_DESCRIPTION_CONTAINER,
          pseudocode_container: INSERTATIONSORT_PSEUDOCODE_CONTAINER,
          performance_container: INSERTATIONSORT_PERFORMANCE_CONTAINER
      };
      var HEAPSORT_OBJECT = {
          func: heapsort,
          description_container: HEAPSORT_DESCRIPTION_CONTAINER,
          pseudocode_container: HEAPSORT_PSEUDOCODE_CONTAINER,
          performance_container: HEAPSORT_PERFORMANCE_CONTAINER
      };

      var ALGORITHMS = {
          "Bubble sort": BUBBLESORT_OBJECT,
          "Selection sort": SELECTIONSORT_OBJECT,
          "Quick sort": QUICKSORT_OBJECT,
          "Shell sort": SHELLSORT_OBJECT,
          "Insertion sort": INSERTATIONSORT_OBJECT,
          "Heap sort": HEAPSORT_OBJECT
      };

      var ARRAY_TYPES = {
          "Random": random_numbers,
          "Reversed": revers_sorted,
          "Few Unique": few_unique
      };

      var GLOBAL_SWAP_NAME = "swap";
      var GLOBAL_COMPARE_NAME = "compare";
      var GLOBAL_INSERT_NAME = "insert";
      var GLOBAL_INSERT_EXTEND_NAME = "insert_extend";
      var GLOBAL_TAKE_TEMP = "take_temp";

      var SPACING = 3;
      var ELEMENTS_CONTAINERS_WIDTH = $(ELEMENTS_CONTAINERS[0]).width();
      var ELEMENTS_MAX_VALUE = $(ELEMENTS_CONTAINERS[0]).height();
      var ELEMENTS_MIN_VALUE = 5;

      //###########################################################################
      //GLOBAL VARIABLES
      //###########################################################################

      var _first_alg_selected = "Bubble sort";
      var _second_alg_selected = "Selection sort";
      var _array_types_select = "Random";

      var _first_alg_object = ALGORITHMS[_first_alg_selected];
      var _second_alg_object = ALGORITHMS[_second_alg_selected];

      var _array_type_func = ARRAY_TYPES[_array_types_select];

      var _elements_count = parseInt($(ELEMENTS_COUNT_SELECT).val(), 10);
      var _elements_to_sort = _array_type_func(ELEMENTS_MIN_VALUE, ELEMENTS_MAX_VALUE, _elements_count);

      var _interval = $(INTERVAL_SELECT).val();
      var _first_setInterval_id = 0;
      var _second_setInterval_id = 0;

      var _had_been_started = false;

      //###########################################################################
      //HELPER METHODS
      //###########################################################################

      function global_swap(array, alg_actions, first_index, second_index, pseudocode_element_id)
      {
          if(first_index !== second_index)
          {
              alg_actions.push([GLOBAL_SWAP_NAME, first_index, second_index, pseudocode_element_id]);

              var t = array[first_index];
              array[first_index] = array[second_index];
              array[second_index] = t;
          }
      }

      function global_compare(array, alg_actions, first_index, second_index, pseudocode_element_id)
      {
          if(first_index !== second_index)
          {
              alg_actions.push([GLOBAL_COMPARE_NAME, first_index, second_index, pseudocode_element_id]);
              return array[first_index] > array[second_index];
          }
      }

      function global_insert(array, alg_actions, index, value, pseudocode_element_id)
      {
          alg_actions.push([GLOBAL_INSERT_NAME, index, value, pseudocode_element_id]);
          array[index] = value;
      }

      function global_insert_extend(array, alg_actions, first_index, second_index, pseudocode_element_id)
      {
          if(first_index !== second_index)
          {
              alg_actions.push([GLOBAL_INSERT_EXTEND_NAME, first_index, second_index, pseudocode_element_id]);

              array[first_index] = array[second_index];
          }
      }

      function global_take_temp(array, alg_actions, index, pseudocode_element_id)
      {
          alg_actions.push([GLOBAL_TAKE_TEMP, index, pseudocode_element_id]);
          return array[index];
      }

      function lock_dom_elements(lock)
      {
          $(STOP_BUTTON).attr("disabled", !lock);
          $(FIRST_ALG_SELECT).attr("disabled", lock);
          $(SECOND_ALG_SELECT).attr("disabled", lock);
          $(ELEMENTS_COUNT_SELECT).attr("disabled", lock);
          $(ARRAY_TYPE_SELECT).attr("disabled", lock);
          $(INTERVAL_SELECT).attr("disabled", lock);
          $(START_BUTTON).attr("disabled", lock);
      }

      function populate_first_alg_select()
      {
          $.each(ALGORITHMS, function(key, value)
          {
              if(_second_alg_selected !== key)
              {
                  $(FIRST_ALG_SELECT).append($("<option>", {
                      value: key,
                      text: key
                  }));
              }
          });
      }

      function populate_second_alg_select()
      {
          $.each(ALGORITHMS, function(key, value)
          {
              if(_first_alg_selected !== key)
              {
                  $(SECOND_ALG_SELECT).append($("<option>", {
                      value: key,
                      text: key
                  }));
              }
          });
      }

      function take_ids(container)
      {
          var ids = [];
          $(container).children().each(function()
                                       {
                                           if(this.id.length > 0)
                                           {
                                               ids.push(this.id);
                                           }
                                       });

          return ids;
      }

      function refresh_content()
      {
          _elements_to_sort = _array_type_func(ELEMENTS_MIN_VALUE,
                                               ELEMENTS_MAX_VALUE,
                                               _elements_count);
          $(INFO_CONTAINERS[0]).empty();
          $(INFO_CONTAINERS[1]).empty();

          $(INFO_CONTAINERS[0]).append(_first_alg_object.description_container);
          $(INFO_CONTAINERS[1]).append(_second_alg_object.description_container);

          draw_elements(ELEMENTS_CONTAINERS[0], _elements_to_sort, _elements_count);
          draw_elements(ELEMENTS_CONTAINERS[1], _elements_to_sort, _elements_count);
      }

      function steps_count(actions)
      {
          var steps_count = [];

          $(actions).each(function()
                                       {
                                           if(this.indexOf("end") === -1)
                                           {
                                               steps_count++;
                                           }
                                       });

          return steps_count;
      }

      function find_is_it_new_selected(container, element, color)
      {
          var curr_color = $(element).css("background-color");
            if(curr_color === DEFAULT_COLOR || curr_color !== color)
            {
                $(container).children().each(function()
                {
                    if($(this).css("background-color") !== DEFAULT_COLOR)
                    {
                        $(this).css("background-color", DEFAULT_COLOR);
                    }
                });

                $(element).css("background-color", color);

                element = null;
            }
      }

      //###########################################################################
      //ARRAY TYPES
      //###########################################################################

      function random(low, high, count)
      {
          var nums = [];
          for(var i = 0; i < count; i += 1)
          {
              nums[i] = low + Math.floor((high - low + 1) * Math.random());
          }
          return nums;
      }

      function random_numbers(low, high, count)
      {
          return random(low, high, count);
      }

      function revers_sorted(low, high, count)
      {
          var arr = random(low, high, count).sort(function(a, b)
                                                  {
                                                      return a - b;
                                                  });

          return arr.reverse();
      }

      function few_unique(low, high, count)
      {
          var arr = [];
          var element_count = count / 10;

          for(var i = 0; i < 10; i++)
          {
              arr = arr.concat(random(low, high, element_count));
          }

          return arr;
      }

      //###########################################################################
      //ALGORITHMS
      //###########################################################################

      function bubblesort(array)
      {
          var elements_count = array.length;
          var actions = [];
          var ids = take_ids(BUBBLESORT_OBJECT.pseudocode_container);

          for(var i = 0; i < elements_count - 1; i++)
          {
              actions.push(ids[0]);

              for(var j = i + 1; j < elements_count; j++)
              {
                  actions.push(ids[1]);

                  if(global_compare(array, actions, i, j, ids[2]))
                  {
                      global_swap(array, actions, i, j, ids[3]);

                      actions.push(ids[4]);
                  }
                  actions.push(ids[5]);
              }

              actions.push(ids[6]);
          }

          return [actions, steps_count(actions)];
      }

      function selectionsort(array)
      {
          var elements_count = array.length;
          var actions = [];
          var ids = take_ids(SELECTIONSORT_OBJECT.pseudocode_container);

          for(var i = 0; i < elements_count - 1; i++)
          {
              actions.push(ids[0]);

              var min_key = i;
              actions.push(ids[1]);

              for(var j = i + 1; j < elements_count; j++)
              {
                  actions.push(ids[2]);

                  if(global_compare(array, actions, min_key, j, ids[3]))
                  {
                      min_key = j;
                      actions.push(ids[4]);

                      actions.push(ids[5]);
                  }

                  actions.push(ids[6]);
              }

              global_swap(array, actions, min_key, i, ids[7]);

              actions.push(ids[8]);
          }

          return [actions, steps_count(actions)];
      }

      function quicksort(array)
      {
          var actions = [];
          var ids = take_ids(QUICKSORT_OBJECT.pseudocode_container);

          function partition(arr, pivot, left, right)
          {
              actions.push(ids[0]);

              var partitionIndex = left;
              actions.push(ids[1]);

              for(var i = left; i < right; i++)
              {
                  actions.push(ids[2]);

                  if(global_compare(arr, actions, pivot, i, ids[3]))
                  {
                      global_swap(arr, actions, i, partitionIndex, ids[4]);

                      partitionIndex++;
                      actions.push(ids[5]);

                      actions.push(ids[6]);
                  }

                  actions.push(ids[7]);
              }

              global_swap(arr, actions, right, partitionIndex, ids[8]);

              actions.push(ids[9]);
              actions.push(ids[10]);

              return partitionIndex;
          }

          function do_quicksort(arr, left, right)
          {
              actions.push(ids[11]);
              actions.push(ids[12]);

              if(left < right)
              {
                  actions.push(ids[13]);

                  var partitionIndex = partition(arr, right, left, right);

                  actions.push(ids[14]);

                  do_quicksort(arr, left, partitionIndex - 1);

                  actions.push(ids[15]);

                  do_quicksort(arr, partitionIndex + 1, right);

                  actions.push(ids[16]);
              }

              actions.push(ids[17]);
          }

          do_quicksort(array, 0, array.length - 1);

          return [actions, steps_count(actions)];
      }

      function heapsort(array)
      {
          var actions = [];
          var ids = take_ids(HEAPSORT_OBJECT.pseudocode_container);

          function heapify(heap_size, start)
          {
              actions.push(ids[0]);

              actions.push(ids[1]);
              var left = start * 2 + 1;

              actions.push(ids[2]);
              var right = start * 2 + 2;

              actions.push(ids[3]);
              var largest = start;

              if(left < heap_size && global_compare(array, actions, left, largest, ids[4]))
              {
                  actions.push(ids[5]);
                  largest = left;

                  actions.push(ids[6]);
              }

              if(right < heap_size && global_compare(array, actions, right, largest, ids[7]))
              {
                  actions.push(ids[8]);
                  largest = right;

                  actions.push(ids[9]);
              }

              actions.push(ids[10]);
              if(largest !== start)
              {
                  global_swap(array, actions, start, largest, ids[11]);

                  actions.push(ids[12]);
                  heapify(heap_size, largest);

                  actions.push(ids[13]);
              }

              actions.push(ids[14]);
          }

          function build_heap(heap_size)
          {
              actions.push(ids[15]);

              for(var i = Math.floor(array.length / 2); i >= 0; i--)
              {
                  actions.push(ids[16]);

                  actions.push(ids[17]);
                  heapify(heap_size, i);

                  actions.push(ids[18]);
              }

              actions.push(ids[19]);
          }

          function perform_heapsort()
          {
              actions.push(ids[20]);

              actions.push(ids[21]);
              build_heap(array.length);

              for(var i = array.length - 1; i > 0; i--)
              {
                  actions.push(ids[22]);

                  global_swap(array, actions, 0, i, ids[23]);

                  actions.push(ids[24]);
                  heapify(i, 0);

                  actions.push(ids[25]);
              }

              actions.push(ids[26]);
          }

          perform_heapsort();

          return [actions, steps_count(actions)];
      }

      function shellsort(array)
      {
          var actions = [];
          var ids = take_ids(SHELLSORT_OBJECT.pseudocode_container);

          var gap = Math.round(array.length / 2);
          actions.push(ids[0]);

          while(gap > 0)
          {
              actions.push(ids[1]);

              for(var i = gap; i < array.length; i++)
              {
                  actions.push(ids[2]);

                  var temp = array[i];
                  actions.push(ids[3]);

                  var j = i;
                  actions.push(ids[4]);

                  while(j >= gap && array[j - gap] > temp)
                  {
                      actions.push(ids[5]);

                      global_insert(array, actions, j, array[j - gap], ids[6]);

                      j = j - gap;
                      actions.push(ids[7]);

                      actions.push(ids[8]);
                  }

                  global_insert(array, actions, j, temp, ids[9]);

                  actions.push(ids[10]);
              }

              gap = Math.round(gap * 5 / 11);
              actions.push(ids[11]);

              actions.push(ids[12]);
          }

          return [actions, steps_count(actions)];
      }

      function insertionsort(array)
      {
          var actions = [];
          var ids = take_ids(INSERTATIONSORT_OBJECT.pseudocode_container);

          for(var i = 1; i < array.length; i++)
          {
              actions.push(ids[0]);

              var temp = global_take_temp(array, actions, i, ids[1]);

              for(var j = i - 1; j >= 0 && (array[j] > temp); j--)
              {
                  actions.push(ids[2]);

                  global_insert_extend(array, actions, j + 1, j, ids[3]);

                  actions.push(ids[4]);
              }

              global_insert(array, actions, j + 1, temp, ids[5]);

              actions.push(ids[6]);
          }

          return [actions, steps_count(actions)];
      }

      //###########################################################################
      //GENERATE ELEMENTS
      //###########################################################################

      function draw_elements(container, elements_heights, elements_count)
      {
          $(container).empty();
          $(container).addClass("loader");

          var elements_width = (ELEMENTS_CONTAINERS_WIDTH - ((elements_count + 1) * SPACING)) / elements_count;
          var dom_elements = [];

          for(var i = 0; i < elements_count; i += 1)
          {
              var algorithm_element = $("<div></div>")
                  .addClass("algorithm_element");

              var left = (i * elements_width) + ((i + 1) * SPACING);

              algorithm_element.width(elements_width);
              algorithm_element.height(elements_heights[i]);
              algorithm_element.css({
                                        left: left
                                    });

              dom_elements.push(algorithm_element);
          }

          $(container).append(dom_elements);
      }

      //###########################################################################
      //ANIMATE SORTING
      //###########################################################################

      function step(container, actions)
      {
          if(actions.length === 0)
          {
              if(container === ELEMENTS_CONTAINERS[0])
              {
                  window.clearInterval(_first_setInterval_id);
                  _first_setInterval_id = null;
              }
              else
              {
                  window.clearInterval(_second_setInterval_id);
                  _second_setInterval_id = null;
              }

              if(_first_setInterval_id === null && _second_setInterval_id === null)
              {
                  lock_dom_elements(false);
              }

              return;
          }

          var action_object = actions.shift();
          var action = action_object[0];
          var first_element;
          var second_element;
          var pseudocode_element;

          if(action === GLOBAL_COMPARE_NAME)
          {
              first_element = $(container).children().eq(action_object[1]);
              second_element = $(container).children().eq(action_object[2]);
              pseudocode_element = $("#" + action_object[3]);

              find_is_it_new_selected(container, first_element, SELECTED_COLOR);

              $(second_element).css("background-color", COMPARED_COLOR);
              $(pseudocode_element).css("background-color", COMPARED_COLOR);
          }
          else if(action === GLOBAL_SWAP_NAME)
          {
              first_element = $(container).children().eq(action_object[1]);
              second_element = $(container).children().eq(action_object[2]);
              pseudocode_element = $("#" + action_object[3]);

              $(first_element).css("background-color", SWAP_COLOR);
              $(second_element).css("background-color", SWAP_COLOR);
              $(pseudocode_element).css("background-color", SWAP_COLOR);

              var t = $(first_element).height();
              $(first_element).height(second_element.height());
              $(second_element).height(t);
          }
          else if(action === GLOBAL_INSERT_NAME)
          {
              var value = action_object[2];

              first_element = $(container).children().eq(action_object[1]);
              pseudocode_element = $("#" + action_object[3]);

              find_is_it_new_selected(container, first_element, INSERT_INTO_ELEMENT_COLOR);
              $(first_element).height(value);
              $(pseudocode_element).css("background-color", INSERT_INTO_ELEMENT_COLOR);
          }
          else if(action === GLOBAL_INSERT_EXTEND_NAME)
          {
              first_element = $(container).children().eq(action_object[1]);
              second_element = $(container).children().eq(action_object[2]);
              pseudocode_element = $("#" + action_object[3]);

              find_is_it_new_selected(container, first_element, INSERT_INTO_ELEMENT_COLOR);
              $(second_element).css("background-color", VALUE_TO_TAKE_COLOR);
              $(first_element).height(second_element.height());
              $(pseudocode_element).css("background-color", VALUE_TO_TAKE_COLOR);
          }
          else if(action === GLOBAL_TAKE_TEMP)
          {
              first_element = $(container).children().eq(action_object[1]);
              pseudocode_element = $("#" + action_object[2]);

              $(first_element).css("background-color", TEMP_VALUE_COLOR);
              first_element = null;
              $(pseudocode_element).css("background-color", TEMP_VALUE_COLOR);
          }
          else
          {
              pseudocode_element = $("#" + action_object);
              $(pseudocode_element).css("background-color", COMPARED_COLOR);
          }

          window.setTimeout(function()
                            {
                                $(first_element).css("background-color", DEFAULT_COLOR);
                                $(second_element).css("background-color", DEFAULT_COLOR);
                                $(pseudocode_element).css("background-color", TEXT_DEFAULT_COLOR);
                            }, _interval - 100);
      }

      //###########################################################################
      //ATTACHED EVENTS
      //###########################################################################

      $(ELEMENTS_COUNT_SELECT).change(function()
                                      {
                                          _elements_count = parseInt($(this).val(), 10);

                                          if(_elements_count < 10 || isNaN(_elements_count) )
                                          {
                                              $(this).val(10);
                                              _elements_count = 10;
                                          }
                                          else if(_elements_count > 200)
                                          {
                                              $(this).val(200);
                                              _elements_count = 200;
                                          }

                                          refresh_content();
                                      });

      $(FIRST_ALG_SELECT).change(function()
                                 {
                                     var alg_name = $(this).val();
                                     var selector = "#" + $(SECOND_ALG_SELECT).attr("id") + " option[value='" + alg_name
                                         + "']";
                                     _first_alg_object = ALGORITHMS[alg_name];

                                     $(selector).remove();
                                     $(SECOND_ALG_SELECT).append($("<option>", {
                                         value: _first_alg_selected,
                                         text: _first_alg_selected
                                     }));

                                     _first_alg_selected = alg_name;

                                     $(INFO_CONTAINERS[0]).empty();
                                     $(INFO_CONTAINERS[0]).append(_first_alg_object.description_container);

                                     if(_had_been_started)
                                     {
                                         refresh_content();

                                         _had_been_started = false;
                                     }
                                 });

      $(SECOND_ALG_SELECT).change(function()
                                  {
                                      var alg_name = $(this).val();
                                      var selector = "#" + $(FIRST_ALG_SELECT).attr("id") + " option[value='" + alg_name
                                          + "']";
                                      _second_alg_object = ALGORITHMS[alg_name];

                                      $(selector).remove();
                                      $(FIRST_ALG_SELECT).append($("<option>", {
                                          value: _second_alg_selected,
                                          text: _second_alg_selected
                                      }));

                                      _second_alg_selected = alg_name;

                                      $(INFO_CONTAINERS[1]).empty();
                                      $(INFO_CONTAINERS[1]).append(_second_alg_object.description_container);

                                      if(_had_been_started)
                                      {
                                          refresh_content();

                                          _had_been_started = false;
                                      }
                                  });

      $(ARRAY_TYPE_SELECT).change(function()
                                  {
                                      var arr_type = $(this).val();
                                      _array_type_func = ARRAY_TYPES[arr_type];

                                      refresh_content();
                                  });

      $(INTERVAL_SELECT).change(function()
                                {
                                    _interval = parseInt($(this).val(), 10);

                                    if(_interval < 250 || isNaN(_interval) )
                                    {
                                        $(this).val(250);
                                        _interval = 250;
                                    }
                                    else if(_interval > 2000)
                                    {
                                        $(this).val(2000);
                                        _interval = 2000;
                                    }

                                    if(_had_been_started)
                                    {
                                        refresh_content();

                                        _had_been_started = false;
                                    }
                                });

      $(START_BUTTON).on("click", function()
      {
          if(_had_been_started)
          {
              refresh_content();

              _had_been_started = false;
          }

          lock_dom_elements(true);

          var _elements_to_sort_copy = _elements_to_sort.slice();

          var first_alg_result = _first_alg_object.func(_elements_to_sort);
          var second_alg_result = _second_alg_object.func(_elements_to_sort_copy);

          var first_alg_actions = first_alg_result[0];
          var second_alg_actions = second_alg_result[0];

          var first_alg_steps_count = first_alg_result[1];
          var second_alg_steps_count = second_alg_result[1];

          $(_first_alg_object.performance_container).children().last().empty().append("<p>Steps Made: "+first_alg_steps_count+"</p>");
          $(_second_alg_object.performance_container).children().last().empty().append("<p>Steps Made: "+second_alg_steps_count+"</p>");

          $(INFO_CONTAINERS[0]).empty();
          $(INFO_CONTAINERS[1]).empty();

          $(INFO_CONTAINERS[0]).append(_first_alg_object.pseudocode_container);
          $(INFO_CONTAINERS[0]).append(_first_alg_object.performance_container);

          $(INFO_CONTAINERS[1]).append(_second_alg_object.pseudocode_container);
          $(INFO_CONTAINERS[1]).append(_second_alg_object.performance_container);

          _first_setInterval_id = window.setInterval(function()
                                                     {
                                                         step(ELEMENTS_CONTAINERS[0], first_alg_actions);
                                                     }, _interval);

          _second_setInterval_id = window.setInterval(function()
                                                      {
                                                          step(ELEMENTS_CONTAINERS[1], second_alg_actions);
                                                      }, _interval);

          _had_been_started = true;
      });

      $(STOP_BUTTON).on("click", function()
      {
          window.clearInterval(_first_setInterval_id);
          window.clearInterval(_second_setInterval_id);

          lock_dom_elements(false);
      });

      //###########################################################################
      //POPULATE DOM
      //###########################################################################

      populate_first_alg_select();
      populate_second_alg_select();

      $.each(ARRAY_TYPES, function(key, value)
      {
          $(ARRAY_TYPE_SELECT).append($("<option>", {
              value: key,
              text: key
          }));
      });

      $(PSEUDOCODES_CONTAINER).empty();
      $(DESCRIPTIONS_CONTAINER).empty();
      $(PERFORMANCES_CONTAINER).empty();

      refresh_content();
  });