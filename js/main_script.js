$(function()
  {

      //###########################################################################
      //CONSTANTS
      //###########################################################################

      var DEFAULT_COLOR  = "#777";
      var SELECTED_COLOR = "#00f";
      var COMPARED_COLOR = "#09f";
      var SINGLE_CHANGE_COLOR = "#f00";
      var SWAP_COLOR     = "#2f0";

      //###########################################################################
      //VARIABLES
      //###########################################################################

      var algorithms = {
          "Bubble sort":         bubblesort,
          "Selection sort":      selectionsort,
          "Heap sort":           heapsort,
          "Quick sort":          quicksort,
          "Shell sort":          shellsort,
          "Insertion sort":      insertionsort
      };

      var initial_array_type = {
          "Random":   random,
          "Sorted":   sorted,
          "Reversed": few_unique
      };

      var num_element_array = [];
      var first_setInterval_id = 0;
      var second_setInterval_id = 0;
      var is_changed = false;

      //###########################################################################
      //HELPER METHODS
      //###########################################################################

      function random_numbers( low, high, count )
      {
          return random(low, high, count );
      }

      function global_swap(array, actions, first, second )
      {
          if(first !== second)
          {
           actions.push([ "swap", first, second]);
          }

          var t      = array[first];
          array[first]= array[second];
          array[second] = t;
      }

      function global_compare(array, actions, first, second )
      {
          if(first !== second)
          {
           actions.push([ "compare", first, second]);
          }

          return array[first] > array[second];
      }

      function global_insert(array, actions, index, value)
      {
          actions.push([ "insert", index, value]);

          array[index] = value;
      }

      function global_insert_extend(array, actions, first, second)
      {
          if(first !== second)
          {
              actions.push([ "insert_extend", first, second]);
          }

          array[first] = array[second];
      }


      //###########################################################################
      //ARRAY TYPES
      //###########################################################################

      function random(low, high, count )
      {
          var nums = [];

          for(var i = 0; i < count; i += 1)
          {
              nums[ i ] = low + Math.floor((high - low + 1) * Math.random());
          }

          return nums;
      }

      function sorted(low, high, count )
      {
          return random_numbers(low, high, count ).reverse();
      }

      function few_unique()
      {

      }

      //###########################################################################
      //ALGORITHMS
      //###########################################################################
      function bubblesort(array)
      {
          var elements_count = array.length;
          var actions = [];

          for(var i = 0; i < elements_count; i++)
          {
              for(var j = i + 1; j < elements_count; j++)
              {

                  if(global_compare(array,actions, i, j))
                  {
                      global_swap(array,actions, i, j);
                  }
              }
          }

          return actions;
      }

      function selectionsort(array)
      {
          var elements_count = array.length;
          var actions = [];

          for (var i = 0; i < elements_count - 1; i++)
          {
              var min_key = i;

              for (var j = i + 1; j < elements_count; j++)
              {
                  if (global_compare(array,actions, min_key, j))
                  {
                      min_key = j;
                  }
              }

              global_swap(array,actions, min_key, i);
          }

          return actions;
      }

      function quicksort(array)
      {
          var actions = [];

          function partition(arr, pivot, left, right){
              var pivotValue = arr[pivot],
                  partitionIndex = left;

              for(var i = left; i < right; i++){
                  if(global_compare(array,actions, pivot, i))
                  {
                      global_swap(array,actions, i, partitionIndex);
                      partitionIndex++;
                  }
              }
              global_swap(array,actions, right, partitionIndex);

              return partitionIndex;
          }

          function do_quicksort(arr, left, right){
              var pivot,
                  partitionIndex;


              if(left < right){
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

      function heapsort( array )
      {
          var actions = [];

          function heapify(heapSize, i) {

              var left = i * 2 + 1;
              var right = i * 2 + 2;
              var largest = i;

              if (left < heapSize && global_compare(array, actions, left, largest)) {
                  largest = left;
              }
              if (right < heapSize && global_compare(array, actions, right, largest)) {
                  largest = right;
              }

              if (largest !== i) {
                  global_swap(array, actions, i, largest);
                  heapify(heapSize, largest);
              }
          }

          function buildHeap(heapSize) {
              for (var i = Math.floor(array.length / 2); i >= 0; i--) {
                  heapify(heapSize, i);
              }
          }

          function perform_heapSort() {
              var heapSize = array.length;
              buildHeap(heapSize);
              while (heapSize > 1) {
                  global_swap(array, actions, 0, --heapSize);
                  heapify(heapSize, 0);
              }
          }

          perform_heapSort();

          return actions
      }

      function shellsort( array )
      {
          var actions = [];

          var increment = array.length / 2;
          while (increment > 0) {
              for (var i = increment; i < array.length; i++) {
                  var j = i;
                  var tmp = array[i];

                  while (j >= increment && array[j-increment] > tmp) {
                      global_insert_extend(array, actions,j,j-increment);
                      j = j - increment;
                  }

                  global_insert(array, actions,j,tmp);
              }

              if (increment === 2) {
                  increment = 1;
              } else {
                  increment = parseInt(increment*5 / 11);
              }
          }
          return actions;
      }

      function insertionsort(array)
      {
          var elements_count = array.length;
          var actions = [];

          for (var i = 1; i < elements_count; i++)
          {
              var tmp = array[i];

              for (var j = i - 1; j >= 0 && (array[j] > tmp); j--)
              {
                  global_insert_extend(array, actions,j+1,j);
              }

              global_insert(array, actions,j+1,tmp);
          }

          return actions;
      }

      //###########################################################################
      //GENERATE ELEMENTS
      //###########################################################################

      function draw_elements()
      {
          var elements_containers = $(".algorithm_div");
          var container_width     = $(elements_containers[ 0 ]).width();
          var spacing             = 3;
          var elements_count      = parseInt($("#elements_count").val(), 10);
          var elements_width      = (container_width - ((elements_count + 1) * spacing)) / elements_count;
          var elements_height     = random_numbers(5, $(elements_containers[ 0 ]).height(), elements_count);

          $(elements_containers[ 0 ]).empty();
          $(elements_containers[ 1 ]).empty();

          for(var i = 0; i < elements_count; i += 1)
          {
              var element_first = $("<div></div>")
                  .addClass("algorithm_element")
                  .attr("id", $(elements_containers[ 0 ]).attr("id") + "_element_" + i);

              var left    = (i * elements_width) + ((i + 1) * spacing);

              element_first.width(elements_width);
              element_first.height(elements_height[ i ]);
              element_first.css({
                              left: left
                          });
              $($(elements_containers[ 0 ])).append(element_first);

              var element_second = $("<div></div>")
                  .addClass("algorithm_element")
                  .attr("id", $(elements_containers[ 1 ]).attr("id") + "_element_" + i);

              element_second.width(elements_width);
              element_second.height(elements_height[ i ]);
              element_second.css({
                                    left: left
                                });
              $($(elements_containers[ 1 ])).append(element_second);
          }

          return elements_height;
      }

      //###########################################################################
      //ANIMATE SORTING
      //###########################################################################

      function animate_sorting()
      {
          var interval    = $("#interval").val();
          var first_sorting_alg = algorithms[ $("#first_algorithm_select").find(":selected").text() ];
          var second_sorting_alg = algorithms[ $("#second_algorithm_select").find(":selected").text() ];

          var num_elements_array_copy= num_element_array.slice();

          var first_alg_actions = first_sorting_alg(num_element_array);
          var second_alg_actions = second_sorting_alg(num_elements_array_copy);

          first_setInterval_id = window.setInterval(function()
                                        {
                                            step("first_algorithm_div", first_alg_actions, interval);
                                        }, interval);

          second_setInterval_id = window.setInterval(function()
                                                          {
                                                              step("second_algorithm_div", second_alg_actions, interval);
                                                          }, interval);
      }

      function step(container_id, actions, interval)
      {
          /*
           * Consumes one step from the action buffer, using it to update
           * the display version of the array and the color array; then
           * draws the display array to the canvas. You should not call this
           * manually.
           */
          if(actions.length === 0)
          {
              if(container_id === "first_algorithm_div")
              {
                  stop_sorting(this._first_setInterval_id);
              }
              else
              {
                  stop_sorting(this._second_setInterval_id);
              }

              return;
          }

          var action_object  = actions.shift();
          var action = action_object[0];
          var first_element;
          var second_element;

          var container = $('#' + container_id);

          if(action === "compare")
          {
              first_element       = container.children().eq(action_object[ 1 ]);
              second_element       = container.children().eq(action_object[ 2 ]);

              $(first_element).css("background-color", SELECTED_COLOR);
              $(second_element).css("background-color", COMPARED_COLOR);
          }
          else if(action === "swap")
          {
              first_element       = container.children().eq(action_object[ 1 ]);
              second_element       = container.children().eq(action_object[ 2 ]);

              $(first_element).css("background-color", SWAP_COLOR);
              $(second_element).css("background-color", SWAP_COLOR);

              var t = $(first_element).height();
              $(first_element).height(second_element.height());
              $(second_element).height(t);
          }
          else if(action === "insert")
          {
              var value = action_object[ 2 ];
              first_element       = container.children().eq(action_object[ 1 ]);

              $(first_element).css("background-color", SINGLE_CHANGE_COLOR);

              $(first_element).height(value);
          }
          else if(action === "insert_extend")
          {
              first_element       = container.children().eq(action_object[ 1 ]);
              second_element       = container.children().eq(action_object[ 2 ]);

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
      //POPULATE DOM
      //###########################################################################

      $("#stop_btn").attr("disabled", true);

      $.each(algorithms, function( key, value )
      {
          $("#first_algorithm_select").append($("<option>", {
              value: key,
              text:  key
          }));

          $("#second_algorithm_select").append($("<option>", {
              value: key,
              text:  key
          }));
      });

      $.each(initial_array_type, function( key, value )
      {
          $("#init_select").append($("<option>", {
              value: key,
              text:  key
          }));
      });

      num_element_array = draw_elements();

      //###########################################################################
      //ATTACHED EVENTS
      //###########################################################################

      $("#elements_count").change(function()
                                  {
                                      num_element_array = draw_elements();
                                  });

      $("#first_algorithm_select").change(function()
                                  {
                                      if(is_changed)
                                      {
                                          num_element_array = draw_elements();
                                      }
                                      is_changed = false;
                                  });

      $("#second_algorithm_select").change(function()
                                          {
                                              if(is_changed)
                                              {
                                                  num_element_array = draw_elements();
                                              }
                                              is_changed = false;
                                          });

      $("#init_select").change(function()
                                           {
                                               num_element_array = draw_elements();
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

          is_changed = true;

          animate_sorting();
      });

      $("#stop_btn").on("click", function()
      {

          window.clearInterval(first_setInterval_id);
          window.clearInterval(second_setInterval_id);

          $("#stop_btn").attr("disabled", true);
          $("#first_algorithm_select").attr("disabled", false);
          $("#second_algorithm_select").attr("disabled", false);
          $("#elements_count").attr("disabled", false);
          $("#init_select").attr("disabled", false);
          $("#interval").attr("disabled", false);
          $("#start_btn").attr("disabled", false);
      });

  });