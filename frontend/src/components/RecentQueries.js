import "../pages/Recent.css";

function RecentQueries(){

return(

<section className="recent">

<h2>Recent Community Activity</h2>

<table>

<thead>
<tr>
<th>Reported Item</th>
<th>Location</th>
<th>Status</th>
<th>Time</th>
</tr>
</thead>

<tbody>

<tr>
<td>Plastic Accumulation</td>
<td>Mumbai Central</td>
<td className="progress">In Progress</td>
<td>2 mins ago</td>
</tr>

<tr>
<td>Overflowing Bin</td>
<td>Bangalore</td>
<td className="resolved">Resolved</td>
<td>45 mins ago</td>
</tr>

<tr>
<td>Construction Debris</td>
<td>Gurgaon</td>
<td className="pending">Pending</td>
<td>3 hours ago</td>
</tr>

</tbody>

</table>

</section>

)

}

export default RecentQueries