<?php
$conn = mysqli_connect('localhost','root','','pizzahub');
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}
?>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
      google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawStuff);

      function drawStuff() {
        var data = new google.visualization.arrayToDataTable([
          ['Date', 'Percentage'],
          <?php
           $sql = "select * from pizza_price";
           $result = mysqli_query($conn,$sql);
           while($row = mysqli_fetch_array($result))
           {

          ?>


          ["<?php echo $row['small']?>", <?php echo $row['medium']?>],
          <?php
           }
          ?>
         
        ]);

        var options = {
          bars: 'horizontal', // Required for Material Bar Charts.
          axes: {
            x: { width:"10%",
             
              0: { side: 'top', label: 'Percentage'} // Top x-axis.
            }
          },
          bar: { groupWidth: "50%"  }
        };

        var chart = new google.charts.Bar(document.getElementById('top_x_div'));
        chart.draw(data, options);
      };
    </script>