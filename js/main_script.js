$(function()
  {

      //###########################################################################
      //CONSTANTS
      //###########################################################################

      var DEFAULT_COLOR = "#777";
      var SELECTED_COLOR = "#00f";
      var COMPARED_COLOR = "#09f";
      var SINGLE_CHANGE_COLOR = "#f00";
      var SWAP_COLOR = "#2f0";

      var ALGORITHMS = {
          "Bubble sort": bubblesort,
          "Selection sort": selectionsort,
          "Heap sort": heapsort,
          "Quick sort": quicksort,
          "Shell sort": shellsort,
          "Insertion sort": insertionsort
      };
      var ARRAY_TYPES = {
          "Random": random_numbers,
          "Reversed": revers_sorted,
          "Few Unique": few_unique
      };

      var SPACING = 3;
      var ELEMENTS_CONTAINERS = $(".algorithm_div");
      var ELEMENTS_CONTAINERS_WIDTH = $(ELEMENTS_CONTAINERS[0]).width();
      var ELEMENTS_MAX_VALUE = $(ELEMENTS_CONTAINERS[0]).height();
      var ELEMENTS_MIN_VALUE = 5;

      //###########################################################################
      //POPULATE DOM
      //###########################################################################

      $("#stop_btn").attr("disabled", true);

      $.each(ALGORITHMS, function(key, value)
      {
          $("#first_algorithm_select").append($("<option>", {
              value: key,
              text: key
          }));

          $("#second_algorithm_select").append($("<option>", {
              value: key,
              text: key
          }));
      });

      $.each(ARRAY_TYPES, function(key, value)
      {
          $("#array_type_select").append($("<option>", {
              value: key,
              text: key
          }));
      });

      //###########################################################################
      //VARIABLES
      //###########################################################################

      var _first_sorting_alg_func = ALGORITHMS[$("#first_algorithm_select").find(":selected").text()];
      var _second_sorting_alg_func = ALGORITHMS[$("#second_algorithm_select").find(":selected").text()];
      var _array_type_func = ARRAY_TYPES[$("#array_type_select").find(":selected").text()];

      var _elements_count = parseInt($("#elements_count").val(), 10);
      var _elements_to_sort = _array_type_func(ELEMENTS_MIN_VALUE, ELEMENTS_MAX_VALUE, _elements_count);

      var _interval = $("#interval").val();
      var _first_setInterval_id = 0;
      var _second_setInterval_id = 0;

      //###########################################################################
      //HELPER METHODS
      //###########################################################################

      function global_swap(array, alg_actions, pseudocode_actions, first, second)
      {
          if(first !== second)
          {
              alg_actions.push(["swap", first, second]);
          }
          var t = array[first];
          array[first] = array[second];
          array[second] = t;
      }

      function global_compare(array, alg_actions, pseudocode_actions, first, second)
      {
          if(first !== second)
          {
              alg_actions.push(["compare", first, second]);
          }
          return array[first] > array[second];
      }

      function global_insert(array, alg_actions, pseudocode_actions, index, value)
      {
          alg_actions.push(["insert", index, value]);
          array[index] = value;
      }

      function global_insert_extend(array, alg_actions, pseudocode_actions, first, second)
      {
          if(first !== second)
          {
              alg_actions.push(["insert_extend", first, second]);
          }
          array[first] = array[second];
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
          var alg_actions = [];
          var pseudocode_actions = [];

          for(var i = 0; i < elements_count; i++)
          {
              for(var j = i + 1; j < elements_count; j++)
              {
                  if(global_compare(array, alg_actions, pseudocode_actions, i, j))
                  {
                      global_swap(array, alg_actions, pseudocode_actions, i, j);
                  }
              }
          }
          return [alg_actions, pseudocode_actions];
      }

      function selectionsort(array)
      {
          var elements_count = array.length;
          var actions = [];
          for(var i = 0; i < elements_count - 1; i++)
          {
              var min_key = i;
              for(var j = i + 1; j < elements_count; j++)
              {
                  if(global_compare(array, actions, min_key, j))
                  {
                      min_key = j;
                  }
              }
              global_swap(array, actions, min_key, i);
          }
          return actions;
      }

      function quicksort(array)
      {
          var actions = [];

          function partition(arr, pivot, left, right)
          {
              var pivotValue = arr[pivot],
                  partitionIndex = left;
              for(var i = left; i < right; i++)
              {
                  if(global_compare(array, actions, pivot, i))
                  {
                      global_swap(array, actions, i, partitionIndex);
                      partitionIndex++;
                  }
              }
              global_swap(array, actions, right, partitionIndex);
              return partitionIndex;
          }

          function do_quicksort(arr, left, right)
          {
              var pivot,
                  partitionIndex;
              if(left < right)
              {
                  pivot = right;
                  partitionIndex = partition(arr, pivot, left, right);
                  //sort left and right
                  do_quicksort(arr, left, partitionIndex - 1);
                  do_quicksort(arr, partitionIndex + 1, right);
              }
              return arr;
          }

          do_quicksort(array, 0, array.length - 1);
          return actions;
      }

      function heapsort(array)
      {
          var actions = [];

          function heapify(heapSize, i)
          {
              var left = i * 2 + 1;
              var right = i * 2 + 2;
              var largest = i;
              if(left < heapSize && global_compare(array, actions, left, largest))
              {
                  largest = left;
              }
              if(right < heapSize && global_compare(array, actions, right, largest))
              {
                  largest = right;
              }
              if(largest !== i)
              {
                  global_swap(array, actions, i, largest);
                  heapify(heapSize, largest);
              }
          }

          function buildHeap(heapSize)
          {
              for(var i = Math.floor(array.length / 2); i >= 0; i--)
              {
                  heapify(heapSize, i);
              }
          }

          function perform_heapSort()
          {
              var heapSize = array.length;
              buildHeap(heapSize);
              while(heapSize > 1)
              {
                  global_swap(array, actions, 0, --heapSize);
                  heapify(heapSize, 0);
              }
          }

          perform_heapSort();
          return actions;
      }

      function shellsort(array)
      {
          var actions = [];
          var increment = array.length / 2;
          while(increment > 0)
          {
              for(var i = increment; i < array.length; i++)
              {
                  var j = i;
                  var tmp = array[i];
                  while(j >= increment && array[j - increment] > tmp)
                  {
                      global_insert_extend(array, actions, j, j - increment);
                      j = j - increment;
                  }
                  global_insert(array, actions, j, tmp);
              }
              if(increment === 2)
              {
                  increment = 1;
              }
              else
              {
                  increment = parseInt(increment * 5 / 11);
              }
          }
          return actions;
      }

      function insertionsort(array)
      {
          var elements_count = array.length;
          var actions = [];
          for(var i = 1; i < elements_count; i++)
          {
              var tmp = array[i];
              for(var j = i - 1; j >= 0 && (array[j] > tmp); j--)
              {
                  global_insert_extend(array, actions, j + 1, j);
              }
              global_insert(array, actions, j + 1, tmp);
          }
          return actions;
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

      function step(container, actions, interval)
      {
          /*
           * Consumes one step from the action buffer, using it to update
           * the display version of the array and the color array; then
           * draws the display array to the canvas. You should not call this
           * manually.
           */
          if(actions.length === 0)
          {
              if(container === ELEMENTS_CONTAINERS[0])
              {
                  window.clearInterval(_first_setInterval_id);
              }
              else
              {
                  window.clearInterval(_second_setInterval_id);
              }
              return;
          }

          var action_object = actions.shift();
          var action = action_object[0];
          var first_element;
          var second_element;

          if(action === "compare")
          {
              first_element = container.children().eq(action_object[1]);
              second_element = container.children().eq(action_object[2]);
              $(first_element).css("background-color", SELECTED_COLOR);
              $(second_element).css("background-color", COMPARED_COLOR);
          }
          else if(action === "swap")
          {
              first_element = container.children().eq(action_object[1]);
              second_element = container.children().eq(action_object[2]);
              $(first_element).css("background-color", SWAP_COLOR);
              $(second_element).css("background-color", SWAP_COLOR);
              var t = $(first_element).height();
              $(first_element).height(second_element.height());
              $(second_element).height(t);
          }
          else if(action === "insert")
          {
              var value = action_object[2];
              first_element = container.children().eq(action_object[1]);
              $(first_element).css("background-color", SINGLE_CHANGE_COLOR);
              $(first_element).height(value);
          }
          else if(action === "insert_extend")
          {
              first_element = container.children().eq(action_object[1]);
              second_element = container.children().eq(action_object[2]);
              $(first_element).css("background-color", SWAP_COLOR);
              $(second_element).css("background-color", SWAP_COLOR);
              $(first_element).height(second_element.height());
          }

          window.setTimeout(function()
                            {
                                $(first_element).css("background-color", DEFAULT_COLOR);
                                $(second_element).css("background-color", DEFAULT_COLOR);
                            }, interval - 100);
      }

      //###########################################################################
      //ATTACHED EVENTS
      //###########################################################################

      $("#elements_count").change(function()
                                  {
                                      _elements_count = parseInt($(this).val(), 10);
                                      _elements_to_sort = _array_type_func(ELEMENTS_MIN_VALUE,
                                                                           ELEMENTS_MAX_VALUE,
                                                                           _elements_count);

                                      draw_elements(ELEMENTS_CONTAINERS[0], _elements_to_sort, _elements_count);
                                      draw_elements(ELEMENTS_CONTAINERS[1], _elements_to_sort, _elements_count);
                                  });

      $("#first_algorithm_select").change(function()
                                          {
                                              var alg_name = $(this).val();
                                              _first_sorting_alg_func = ALGORITHMS[alg_name];
                                          });

      $("#second_algorithm_select").change(function()
                                           {
                                               var alg_name = $(this).val();
                                               _second_sorting_alg_func = ALGORITHMS[alg_name];
                                           });

      $("#array_type_select").change(function()
                                     {
                                         var arr_type = $(this).val();
                                         _array_type_func = ARRAY_TYPES[arr_type];

                                         _elements_to_sort = _array_type_func(ELEMENTS_MIN_VALUE,
                                                                              ELEMENTS_MAX_VALUE,
                                                                              _elements_count);
                                         draw_elements(ELEMENTS_CONTAINERS[0], _elements_to_sort, _elements_count);
                                         draw_elements(ELEMENTS_CONTAINERS[1], _elements_to_sort, _elements_count);
                                     });

      $("#start_btn").on("click", function()
      {
          $("#stop_btn").attr("disabled", false);
          $("#first_algorithm_select").attr("disabled", true);
          $("#second_algorithm_select").attr("disabled", true);
          $("#elements_count").attr("disabled", true);
          $("#init_select").attr("disabled", true);
          $("#interval").attr("disabled", true);
          $("#start_btn").attr("disabled", true);

          var first_alg_actions = _first_sorting_alg_func(_elements_to_sort);
          var second_alg_actions = _second_sorting_alg_func(_elements_to_sort.slice());

          _first_setInterval_id = window.setInterval(function()
                                                     {
                                                         step(ELEMENTS_CONTAINERS[0], first_alg_actions);
                                                     }, _interval);

          _second_setInterval_id = window.setInterval(function()
                                                      {
                                                          step(ELEMENTS_CONTAINERS[1], second_alg_actions);
                                                      }, _interval);
      });

      $("#stop_btn").on("click", function()
      {
          window.clearInterval(_first_setInterval_id);
          window.clearInterval(_second_setInterval_id);

          $("#stop_btn").attr("disabled", true);
          $("#first_algorithm_select").attr("disabled", false);
          $("#second_algorithm_select").attr("disabled", false);
          $("#elements_count").attr("disabled", false);
          $("#init_select").attr("disabled", false);
          $("#interval").attr("disabled", false);
          $("#start_btn").attr("disabled", false);
      });

      draw_elements(ELEMENTS_CONTAINERS[0], _elements_to_sort, _elements_count);
      draw_elements(ELEMENTS_CONTAINERS[1], _elements_to_sort, _elements_count);
  });